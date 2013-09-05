// uses https://github.com/andrewluetgers/ngTest
ngTest({"common - uiText: A util for centralizing UI strings": [
	"uiText:",
		"uiTextConfig",
		"$T",
	{

		"Should default to english language": function() {
			expect(uiTextConfig.lang).toBe("en");
		},

		"Should not have any pre-loaded strings": function() {
			expect(uiTextConfig.strings.en).toBe(undefined);
		},

		"Should load language strings": function() {
			var bundle = {
				en: {
					testHi:					"Hello",
					testThanks:				"Thanks %0!",
					testNetworkError:		"Network Error: %type \nThere was an error attempting to " +
											"connect to the server (%url) please check your connection and try again."
				}
			};
			$T.loadTextBundle(bundle);
			expect(uiTextConfig.strings).toEqual(bundle);
		},

		"Should retrieve an english string by id": function() {
			expect($T("testHi")).toEqual("Hello");
		},

		"Should retrieve an array formatted string without replaced values": function() {
			expect($T("testThanks")).toEqual("Thanks %0!");
			expect($T("testThanks", [])).toEqual("Thanks %0!");
		},

		"Should retrieve an array formatted string with replaced values": function() {
			expect($T("testThanks", ["foo"])).toEqual("Thanks foo!");
		},

		"Should retrieve an object formatted string with replaced values": function() {
			expect($T("testNetworkError", {type: "foo", url: "bar"})).toEqual("Network Error: foo \nThere was an error attempting to connect to the server (bar) please check your connection and try again.");
		},

		"Should throw on invalid string id": function() {
			expect(function() {
				$T("fooBar");
			}).toThrow(new Error("No text string: fooBar for lang:en"));
		},

		"Should add new strings to an existing language": function() {
			$T.loadTextBundle({en: {testHey: "hey"}});
			expect(uiTextConfig.strings.en.testHey).toBe("hey");
		},

		"Should override existing strings in an existing language": function() {
			$T.loadTextBundle({en: {testHi: "hi"}});
			expect(uiTextConfig.strings.en.testHi).toBe("hi");
		},

		"Should override existing strings in an existing language and warn by logging when warn is truthy": function() {
			var lang = "en",
				key = "testHi",
				prev = "hi",
				val = "hi1",
				msg = "$T.loadTextBundle is overwriting " + lang + ":" + key +", '"+prev+"' with '" + val + "'";

			spyOn(console, 'log');

			$T.loadTextBundle({en: {testHi: "hi1"}}, true);
			expect(uiTextConfig.strings.en.testHi).toBe("hi1");
			expect(console.log).toHaveBeenCalledWith(msg);
		},

		"Should fail to override existing strings in an existing language when warn is set to throw": function() {
			var lang = "en",
				key = "testHi",
				prev = "hi1",
				val = "hi2",
				msg = "$T.loadTextBundle is overwriting " + lang + ":" + key +", '"+prev+"' with '" + val + "'";

			expect("foo").toBe("foo");
			expect(function() {
				$T.loadTextBundle({en: {testHi: "hi2"}}, "throw");
			}).toThrow(new Error(msg));
		},

		"Should add a new language": function() {
			var bundle = {fr: {testHi: "bonjour"}};
			$T.loadTextBundle(bundle);
			expect(uiTextConfig.strings.fr).toEqual(bundle.fr);
		},

		"Should override current language": function() {
			expect($T("testHi", null, "fr")).toEqual("bonjour");
		},

		"Should set the current language": function() {
			$T.setLang("fr");
			expect($T("testHi")).toEqual("bonjour");
		},

		"Should throw on setting an invalid language": function() {
			expect(function() {
				$T.setLang("foo");
			}).toThrow(new Error("No text bundle loaded for foo"));
		}

	}]
});
/*
 * ngText.js 0.1.0 09-5-2013
 * copyright (c) 2013 Andrew Luetgers
 * you are free to distribute ngText.js under the MIT license
 * https://github.com/andrewluetgers/ngText
 */


/**
 * compliment this service with a language pack like so
 *
 * angular.module("myTextBundle", ["ngText"])
 *	 .value("myTextBundle", {
 *		 en: {
 *			 error:					"There was an error",
 *			 thanks:				"Thanks!",
 *			 networkError:			"Network Error: %status \nThere was an error attempting to " +
 *			 						"connect to the server %server \nPlease check your connection and try again.",
 *			 accessDenied:			"Access Denied, you must log in to access \n%1",
 *			 loggedOut:				"Successfully logged out."
 *		 },
 *		 fr: {.....}
 *	 })
 *	 .run(function(myTextBundle, $T) {
 *		$T.loadTextBundle(myTextBundle);
 *	 });
 *
 * then set the lang like so, it defaults to "en"
 * $T.setLang("fr"); *
 *
 * get strings like so
 * $T("thanks");
 *
 * provide data objects for string substitution by key
 * $T("networkError", {status: "404", server: "myserver.com"});
 *
 * provide data arrays for string substitution by index
 * $T("accessDenied", ["some.url.com/private"]);
 *
 */

angular.module("ngText", [])

	.factory("$T", function(ngTextConfig) {

		var getReg = _.memoize(function(id) {
			return new RegExp("%"+id, "g");
		});

		/**
		 * @param id (string) corresponds to a key in the language
		 *		pack for the current language
		 * @param data (array or object) values to be mapped into
		 *		the selected ui text where %key or %index corresponds
		 *		to the value to use from the provided object or array
		 * @param _lang (string) if provided will override the
		 *		current language for this call only
		 * @return (string)
		 */
		function $T(id, data, _lang) {
			var lang = _lang || ngTextConfig.lang,
				strings = ngTextConfig.strings[lang],
				result = "";

			if (strings && id in strings) {
				result = strings[id];
				_.each(data, function(val, id) {
					result = result.replace(getReg(id), _.escape(val));
				});
				return result;
			} else {
				throw new Error("No text string: "+id+" for lang:"+lang);
			}
		}

		$T.setLang = function(lang) {
			if (lang in ngTextConfig.strings) {
				ngTextConfig.lang = lang;
			} else {
				throw new Error("No text bundle loaded for "+lang);
			}
		};

		/**
		 * load up a textBundle for one or more languages
		 * @param bundle (Object) - a UI textBundle of the format
		 *		{lang1: {key1:val1, key2:val2, etc....}, lang2: {key1:val1, key2:val2, etc....}}
		 * @param warn (mixed) - for the string "throw" will throw
		 *		an error when pre-existing strings are overwritten
		 *		other truthy values log a message instead
		 */
		$T.loadTextBundle = function(bundle, warn) {
			_.each(bundle, function(strings, lang) {
				if (!ngTextConfig.strings[lang]) {
					ngTextConfig.strings[lang] = strings;
				} else {
					_.each(strings, function(val, key) {
						var prev = ngTextConfig.strings[lang][key];
						if (warn && prev) {
							var msg = "$T.loadTextBundle is overwriting " + lang + ":" + key +", '"+prev+"' with '" + val + "'";
							if (warn == "throw") {
								throw new Error(msg);
							} else {
								console.log(msg);
							}
						}
						ngTextConfig.strings[lang][key] = val;
					});
				}
			});
		};

		return $T;
	})

	.value('ngTextConfig', {
		lang: "en",
		strings: {}
	});
ngText
======

An angular service for centralizing UI strings and supporting multiple languages.

Compliment this service with a language pack like so...

```JavaScript
angular.module("myTextBundle", ["ngText"])
	 .value("myTextBundle", {
		 en: {
			 error:					"There was an error",
			 thanks:				"Thanks!",
			 networkError:			"Network Error: %status \nThere was an error attempting to " +
			 						"connect to the server %server \nPlease check your connection and try again.",
			 accessDenied:			"Access Denied, you must log in to access \n%1",
			 loggedOut:				"Successfully logged out."
		 },
		 fr: {.....}
	 })
	 .run(function(myTextBundle, $T) {
		$T.loadTextBundle(myTextBundle);
	 });
```

Set the language, default is "en"

```JavaScript
$T.setLang("fr");
```

Get strings

```JavaScript
$T("thanks");
```

Provide data objects for string substitution by key

```JavaScript
$T("networkError", {status: "404", server: "myserver.com"});
```

Provide data arrays for string substitution by index

```JavaScript
$T("accessDenied", ["some.url.com/private"]);
```


Read the source and tests for more documentation and usage examples.

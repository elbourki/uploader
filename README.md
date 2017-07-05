# uploader
uploader is an open source library that provides ajax file uploading using JQuery Ajax, and it's lightweight and customizable
# Demo
You can check the demo [here](https://elbourki.github.io/uploader/)
# Getting Started
Let's get started using uploader!

First, we need to have an input in our page.

```html
<input type="file" id="input">
```

Now that we have an input we can use, we need to include uploader.js in our page.

```html
<script src="../path/uploader.js" />
```

Now, to create the uploader , add this script to your page:

```javascript
$('#input').uploader({
	action        : 'api/upload.php', // Where to send files 
	uploadText    : 'Upload File', // Upload file translation
	uploadingText : 'Uploading File', // Uploading file trnaslation
	uploadedText  : "File uploaded successfully", // File uploaded successfully translation
	uploadData    : { 'key' : 'value' }, // Append POST data to the upload
	uploadOptions : { dataType : 'text' }, // Customise the parameters passed to the $.ajax() call on uploads. You can use any of the normal $.ajax() params
	before	      : function(){}, // Run stuff before the upload happens
	success       : function(data, textStatus, jqXHR){ console.log(data); }, // Callback on completion with 200 status code
	error 	      : function(jqXHR, textStatus, errorThrown){ console.log(jqXHR); }, // Callback if an error happens with your upload ajax call
	complete      : function(jqXHR, textStatus){ console.log(jqXHR); } // Callback on completion
});
```
It's that easy to get started using uploader.js!
# License
This project is licensed under the terms of the MIT license.

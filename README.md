#jQuery Auto Builder

An NPM package to help you automate the process of building your custom version of jQuery.

##How to use it

Just Install it using npm
`npm install jquery-auto-builder`

Then, you can simply use the command-line tool to build your custom version of jquery. 

`jquery-auto-builder [filename, filename,...] [options]`

`filename` is the name of the file where you have your jquery code. jQuery Auto Builder will read your file and build a dry version of jQuery with only the modules you need to run your code. 

Supported `options`:

+ `-o` -- the name of the output jquery file. By default, jQuery Auto Builder will save a file named *jquery.custom.min.js* or *jquery.custom.js* on the current directory. This option does not force directory creation.
+ `-d` -- build jquery in developer mode. By default, jQuery Auto Builder builds a minified version of jQuery.
+ `-v` -- Choose the version of jQuery you want to build. JQuery Auto Builder only builds the latest stable version of jQuery 1.\* and 2.\*. Current possible values are:
  + `1` -- Builds jQuery v.1.11.1  
  + `2` -- Builds jQuery v.2.1.1

###Example

Building a minified version of jQuery 2.1.1 based on the file `main.js`, where all your jQuery code lives. Simply run:

`jquery-auto-builder main.js`

A file called jquery.custom.min.js will be created on your current dir with your custom jQuery.

If you wanted a developer version of jQuery 1.11.1 built, based on 3 different files, and the output to have a different name, then you would run:

`jquery-auto-builder main-1.js main-2.js, main-3.js -d -v 1 -o dist/jquery.dev.dry.js`

A file named `jquery.dev.dry.js` would be created on your `dist` (should exist before you run the command) folder with a developer dry version of jQuery v.1.11.1.
  

##Support, Issues and Feedback

Any kind of support and feedback will be of great help. 

##Credits

The core part of this code relies deeply on jQuery's code.

##License

[MIT License](http://vicnicius.mit-license.org/) © Vinícius Andrade

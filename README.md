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
+ `-v` -- Choose the version of jQuery you want to build. JQuery Auto Builder only builds the latest stable version of jQuery 1.\* and 2.\*. Currently options are:
  + `1` -- Builds jQuery v.1.11.1  
  + `2` -- Builds jQuery v.2.1.1

##Support, Issues and Feedback

Any kind of support and feedback will be of great help. 

##License

[MIT License](http://vicnicius.mit-license.org/) © Vinícius Andrade

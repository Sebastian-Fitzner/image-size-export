Image Size Export
============

Pass a folder of images to this module and get infos like: 
- width
- height
- name 
- path 
- breakpoint (when you provide this information in your filename)

Written with [ImageSize](https://www.npmjs.com/package/image-size).

## Installation

`npm install image-size-export`

## Usage

Read pictures infos from a provided source, process its infos and output processed infos to a custom output file (default = JSON).

``` js

var imageExport = require('image-size-export');

imageExport.record({
	path: 'tmp/pictures/**/*.jpg',
	output: "tmp/simple.json",
	breakpointDelimiter: '--'
});

```

When your file structure looks like that: 
``` bash
├───tmp
│   └───pictures
│       ├───carousel
│       │   └───stage
│       │           pic-01--1025.jpg
│       │           pic-01--1025_2x.jpg
│       │           pic-01--320.jpg
│       │           pic-01--320_2x.jpg
│       │           pic-01--769.jpg
│       │
│       └───marginal
│           ├───contact
│           │       pic-01--480.jpg
│           │       pic-01--480_2x.jpg
│           │       pic-01--768.jpg
│           │       pic-01--768_2x.jpg
│           │       pic-01--769.jpg
│           │       pic-01--769_2x.jpg
│           │
│           └───images
│                   pic-01--480.jpg
│                   pic-01--480_2x.jpg
│                   pic-01--640.jpg
│                   pic-01--640_2x.jpg
│                   pic-01--768.jpg
│                   pic-01--768_2x.jpg
│                   pic-01--769.jpg
│                   pic-01--769_2x.jpg
``` 

You will get the following default output:

``` json
[
	{
		"breakpoint": "1025",
		"name": "pic-01--1025.jpg",
		"width": 1344,
		"height": 536,
		"path": "tmp/pictures/carousel/stage/pic-01--1025.jpg"
	},
	{
		"...": "..."
	}
]
```

This output can completely customized with a handlebars template. 

Furthermore there are options you can use to categorize your image infos (see `categorizeBy` option). 

## Options

#### path
Type: `string`
Default value: false

Path to your image files. 

#### output
Type: `string`
Default value: 'imageSizeExport.json'

Generated JSON file which will be compiled via handlebars template.

#### folderDepth
Type: `number`
Default value: 1

Define, how many folders should be considered for generating a folder name. 

#### categorizeBy
Type: `string`
Default value: false

Define if you want to export your informations as JSON categorized by `breakpoints` or `folders`.

#### breakpointDelimiter
Type: `string`
Default value: '--'

A string value that is used to set as delimiter for your breakpoints which are defined in your filename.

#### template
Type: `string`
Default value: 'templates/simple.hbs'

Path to custom or default handlebars template.

## Api 

### record({options})

Get all infos from your picture files. 

You can pass `options` as argument to override default options and specify your path (see `Options`). 

## Examples

### Custom Handlebars Template

Let's say you are not happy with the default output and want to use a custom handlebars template to generate something really nice. That's is really simple. 

Define your options:
``` js
imageExport.record({
	path: 'tmp/pictures/**/*.jpg',
	output: "tmp/custom.yml",
	template: 'tmp/tpl/custom.hbs',
	breakpointDelimiter: '-'
});
```

Write your template like that: 

``` hbs
{{#each breakpoints}}
"{{this}}":
{{#each ../images}}
	{{#is ../this breakpoint}}
	-- "name": "{{ name }}"
	- "width": {{ width }}
	- "height": {{ height }}
	- "path": "{{ path }}"
	{{/is}}
{{/each}}
{{/each}}
```

And the output will be:

``` yml
"1025":
	-- "name": "pic-01--1025.jpg"
	- "width": 1344
	- "height": 536
	- "path": "tmp/pictures/carousel/stage/pic-01--1025.jpg"
"1025_2x":
	-- "name": "pic-01--1025_2x.jpg"
	- "width": 2051
	- "height": 817
	- "path": "tmp/pictures/carousel/stage/pic-01--1025_2x.jpg"
"320":
	-- "name": "pic-01--320.jpg"
	- "width": 320
	- "height": 128
	- "path": "tmp/pictures/carousel/stage/pic-01--320.jpg"
	...
```

_Please be sure you do not use the `categorizeBy` option, because this option outputs a JSON file and ignores any template._

### Categorize by Folders

If you want to categorize your infos by folder name and export these as JSON file, you can use the following setting: 

``` js
imageExport.record({
	path: 'tmp/pictures/**/*.jpg',
	output: "tmp/folder.json",
	categorizeBy: 'folders',
	folderDepth: 2,
	breakpointDelimiter: '-'
});
```

The `folderDepth` option can be used when you need to concatenate multiple folder names to one single string.

### Categorize by Breakpoints

If you want to categorize your infos by breakpoints and export these as JSON file, you can use the following setting: 

``` js

imageExport.record({
	path: 'tmp/pictures/**/*.jpg',
	output: "tmp/breakpoints.json",
	categorizeBy: 'breakpoints',
	breakpointDelimiter: '--'
});
```

The `breakpointDelimiter` option can be used to define your delimiter between breakpoint and filename.

## Grunt Plugin

There is also a grunt wrapper for this npm module. See [grunt-image-size-export](https://github.com/Sebastian-Fitzner/grunt-image-size-export)

## License
Copyright (c) 2015 Sebastian Fitzner. Licensed under the MIT license.

## ToDos

- Add tests

ImageSize Export
============

Pass a folder of images to this module and get infos like: 
- width
- height
- name 
- path 
- breakpoint 

Written with [ImageSize](https://www.npmjs.com/package/image-size).


## Installation

`$ npm install imagesize-export`

## Usage (wip)

## Options

#### path
Type: `string`
Default value: false

Path to your image files. 

#### output
Type: `string`
Default value: 'imageSize.json'

Generated JSON file which will be compiled via handlebars template.

#### breakpoints (wip)
Type: `string`
Default value: 'file'

Define where the module can get the infos for your breakpoint. 

#### delimiter
Type: `string`
Default value: '--'

A string value that is used to set as delimiter for your breakpoints.

#### template
Type: `string`
Default value: 'templates/json.hbs'

Path to custom or default handlebars template.

## Grunt Plugin (wip)

## License
Copyright (c) 2015 Sebastian Fitzner. Licensed under the MIT license.

## ToDos

- Add tests
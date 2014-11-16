# glry

Image gallery with mobile/touch support and no dependencies. This gallery does not require you to specify all the images in the markup beforehand, instead you supply a `load` function which returns the next/prev image. This makes it ideal for large or dynamic galleries, where the next image should be loaded based on changing logic.

This library is also used as a base for [daily-glry](https://github.com/omichelsen/daily-glry.git), which is an extension specifically designed for daily comic strips.

## Install

```bash
$ bower install glry --save
```

Include the library in your web page:

```html
<script src="bower_components/glry/glry.js"></script>
```

glry has no other dependencies.

## Usage

Initialize the gallery with a minimal set of options like this:

    var glry = new Glry({
            load: function (direction) {
                if (direction === 'left')
                    return 'prev-image.jpg';
                else
                    return 'next-image.jpg';
            }
        });

The only required option is `load` which should be a function that returns the URL of the next/prev image. The function is passed a `direction` string parameter indicating whether the navigation direction is `left` or `right`.

The available options and their defaults are as follows:

    {
        target: '#figure',
        animationSpeed: 250,
        enableKeyboard: true,
        onLoadStart: false,
        onLoadEnd: false
    }

If you want to do some work before or after an image has loaded, you can pass a function to `onLoadStart`/`onLoadEnd`.

Keyboard navigation is enabled per default, and maps to the right/left arrow keys to go to next/prev image.

## Licence
The MIT License (MIT)

Copyright (c) 2014 Ole Michelsen http://ole.michelsen.dk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

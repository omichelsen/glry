# glry

[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Image gallery with mobile/touch support and no dependencies.

__[See the demo](http://rawgit.com/omichelsen/glry/master/demo/index.html)__

Does not require you to specify all the images in the markup beforehand, instead you supply a `load` function which returns the next/prev image. This makes it ideal for large or dynamic galleries, where the images should be loaded based on changing logic.

glry is also used as a base for [daily-glry](https://github.com/omichelsen/daily-glry.git), which is an extension specifically designed for daily comic strips.

## Install

```bash
$ npm install glry --save
```

## Usage

Place some basic HTML on your page:

```html
<figure id="figure">
    <div class="loading">LOADING</div>
    <div class="error">ERROR</div>
    <nav class="navigation">
        <button class="prev">◀</button>
        <button class="next">▶</button>
    </nav>
</figure>
```

Initialize the gallery with a minimal set of options like this:

```js
import Glry from 'glry';

const glry = new Glry({
    load: (direction) => {
        if (direction === 'left') {
            return 'prev-image.jpg';
        } else {
            return 'next-image.jpg';
        }
    },
    canNavigate: (direction) => true,
});
```

The only required option is `load` which should be a function that returns the URL of the next/previous image. The function is passed a `direction` parameter indicating whether the navigation direction is "left" or "right".

You can optionally specify a `canNavigate` function, to prevent swiping in a given direction. This can be useful if you don't have an infinite amount of images and want to signal that the user has reached the end (or beginning).

### Options

The available options and their defaults are as follows:

```js
{
    target: '#figure',
    animationSpeed: 250,
    enableKeyboard: true,
    onLoadStart: false,
    onLoadEnd: false
}
```

If you want to do some work before or after an image has loaded, you can pass a function to `onLoadStart`/`onLoadEnd`.

Keyboard navigation is enabled per default, and maps to the <kbd>◀</kbd> / <kbd>▶</kbd> arrow keys to go to next/previous image.

[travis-image]: https://img.shields.io/travis/omichelsen/glry/master.svg
[travis-url]: https://travis-ci.org/omichelsen/glry
[coveralls-image]: https://img.shields.io/coveralls/omichelsen/glry/master.svg
[coveralls-url]: https://coveralls.io/r/omichelsen/glry?branch=master
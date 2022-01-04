# @glry/daily

Daily comic strip gallery with mobile/touch support.

Intended for daily comic strips and based on the current date. Specify a start date for the earliest comic, and browse through all strips up to current day.

Supports touch gestures (swipe & shake) and the following keyboard shortcuts:

<kbd>◀</kbd> previous date
<kbd>▶</kbd> next date
<kbd>R</kbd> random comic
<kbd>T</kbd> today's comic

@glry/daily is an extension to [@glry/core](https://github.com/omichelsen/glry.git) and requires [date-fns](https://github.com/date-fns/date-fns).

## Install

```bash
$ npm install @glry/daily
```

## Usage

Place some basic HTML on your page:

```html
<figure id="figure">
  <div class="loading">LOADING</div>
  <div class="error">STRIP MISSING</div>

  <nav class="navigation">
    <button class="prev">◀</button>
    <button class="rand">Random</button>
    <button class="next">▶</button>
    <button class="today">Today</button>
    <button class="share">Share</button>
  </nav>
</figure>
```

Initialize the gallery with a minimal set of options like this:

```js
import DailyGlry from '@glry/daily';

const dailyGlry = new DailyGlry({
  dateMin: new Date(2014, 1, 22),
  host: 'http://mycomic.com/archive/',
  extension: '.png',
  onOutOfRange: () => alert('No more comics until tomorrow.')
});
```

The only required option is `host` which should be the base domain and folder of your comics. This will be used to load the daily comic file. The current year and date will be appended to `host` like this:

    http://mycomic.com/archive/2014/20140204.png

### Options

The available options and their defaults are as follows:

```js
{
  target: '#figure',
  host: null,
  hashFormat: 'YYYY-MM-DD',
  nameFormat: 'YYYY/YYYYMMDD',
  extension: '.png',
  onOutOfRange: false
}
```

You can change the filename and hash format with `nameFormat`/`hashFormat` using this [syntax](https://date-fns.org/v2.16.1/docs/parse).

If a date outside the specified range is called, you can call custom logic by passing a function to `onOutOfRange`.

All the options available in [glry](https://github.com/omichelsen/glry) can also be used.

## Shake support (optional)

If you include the great plugin [shake.js](https://github.com/alexgibson/shake.js), shaking your device will load a random comic same as pressing <kbd>R</kbd>.

Just install the plugin and include it:

```bash
$ npm install shake.js
```

```js
import Shake from 'shake.js';

const myShakeEvent = new Shake({
  threshold: 15, // optional shake strength threshold
  timeout: 1000 // optional, determines the frequency of event generation
});

myShakeEvent.start();
```

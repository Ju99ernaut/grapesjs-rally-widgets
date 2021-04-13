# Grapesjs Rally Widgets

(WIP) Library of components that rely on the [rally.io](https://rally.io) API

[DEMO](https://blocomposer.com/editor)

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/grapesjs-rally-widgets/dist/grapesjs-rally-widgets.min.css">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-rally-widgets"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
	container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['grapesjs-rally-widgets'],
});
```

### CSS
```css
body, html {
  margin: 0;
  height: 100%;
}
```


## Summary

* Plugin name: `grapesjs-rally-widgets`
* Components
    * `widget`
    * `price-ticker`
    * `rally-deeplink`
* Blocks
    * `price-ticker`
    * `rally-deeplink`
* Commands
    * `widget-code`



## Options

| Option | Description | Default |
|-|-|-
| `modalCopyTitle` | Modal title | `Widget` |
| `copyViewerOptions` | Options for extending the codeviewer | `{}` |
| `widgetComponent` | Options for extending the widget model | `{}` |
| `rallyUrl` | Url for rally api | `https://api.rally.io/v1/` |



## Download

* CDN
  * `https://unpkg.com/grapesjs-rally-widgets`
* NPM
  * `npm i grapesjs-rally-widgets`
* GIT
  * `git clone https://github.com/Ju99ernaut/grapesjs-rally-widgets.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<link rel="stylesheet" href="https://unpkg.com/grapesjs-rally-widgets/dist/grapesjs-rally-widgets.min.css">
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-rally-widgets.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-rally-widgets'],
      pluginsOpts: {
        'grapesjs-rally-widgets': { /* options */ }
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-rally-widgets';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-rally-widgets/dist/grapesjs-rally-widgets.min.css'

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/Ju99ernaut/grapesjs-rally-widgets.git
$ cd grapesjs-rally-widgets
```

Install dependencies

```sh
$ npm i
```

Build sass

```sh
$ npm run build:css
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT

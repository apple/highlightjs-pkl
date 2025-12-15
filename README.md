# highlightjs-pkl

![NPM Version](https://img.shields.io/npm/v/@apple/highlightjs-pkl)

This repository hosts a Highlight.js library for [the Pkl programming language](https://pkl-lang.org).

## Usage

### Simple Usage

Simply include the Highlight.js library as an asset in your HTML:

```html
<script type="text/javascript" src="/path/to/highlightjs.min.js" />
<script type="text/javascript" src="/path/to/highlightjs-pkl/dist/pkl.min.js" />
<script type="text/javascript">
  hljs.highlightAll();
</script>
```

### Node.js

To use from Node.js, or when bundled with Webpack (or another packer):

```bash
npm install @apple/highlightjs-pkl
```

And import as an ES6 module:

```javascript
import hljs from "highlight.js";
import pkl from "@apple/highlightjs-pkl";

hljs.registerLanguage("pkl", pkl);
```

### Alternative usage patterns.

There's a lot more ways to use highlight.js.
For more information, see their [README](https://github.com/highlightjs/highlight.js/blob/main/README.md).

## License

highlightjs-pkl is released under the Apache 2.0 License.
See [LICENSE](LICENSE.txt) file for details.

Highlight.js is released under the BSD 3-Clause License.
See [LICENSE](https://github.com/highlightjs/highlight.js/blob/main/LICENSE) file for details.

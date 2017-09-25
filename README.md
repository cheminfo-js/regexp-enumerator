# regexp-enumerator

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

Generate all possible combinations given a regular expression.

## Installation

`$ npm install --save regexp-enumerator`

## Usage

The way of use if shown below:

```js
import {generateRegExp} from 'regexp-enumerator';

var regexp = /[ab]/;
var options = {};

var result = generateRegExp(regexp, options).sort();
// result is ['a', 'b']
```

You are also allowed to use '*' and '+' operator using the maxSize operator on the options

```js
import {generateRegExp} from 'regexp-enumerator';

var regexp = /a*/;
var options = {
    maxSize: 4
};

var result = generateRegExp(regexp, options).sort();
// result is ['', 'a', 'aa', 'aaa', 'aaaa']
```

If you use the not operator, you should provide the character universe allowed (a regular expression).

```js
import {generateRegExp} from 'regexp-enumerator';

var result = generate(/[^ab]*/, {
            maxSize: 2,
            universe: /[a-f]/
        }).sort();
// result is['', 'c', 'cc', 'cd', 'ce', 'cf', 'd', 'dc', 'dd', 'de', 'df', 'e', 'ec', 'ed', 'ee', 'ef', 'f', 'fc', 'fd', 'fe', 'ff'];
```

The default value for `universe` and `maxSize` are `/[a-z]/` and `10` respectively.

## [API Documentation](https://cheminfo.github.io/regexp-enumerator/)

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/regexp-enumerator.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/regexp-enumerator
[travis-image]: https://img.shields.io/travis/cheminfo/regexp-enumerator/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo/regexp-enumerator
[download-image]: https://img.shields.io/npm/dm/regexp-enumerator.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/regexp-enumerator

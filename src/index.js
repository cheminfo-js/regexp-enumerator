import ret from 'ret';
import {checkCharSet, pushArray} from './utils';

/**
 * @class Generator
 */
export default class Generator {
    constructor(regexp, options={}) {
        var {
            infSize = 10,
            charSet = /[a-z]/
        } = options;

        this.tokens = ret(regexp.source);
        this.infSize = infSize;
        this.charSet = checkCharSet(ret(charSet.source));
    }

    generate() {
        return this._generate(this.tokens, ['']);
    }

    _generate(tokens, build) {
        var isGroup = tokens.type === ret.types.ROOT || tokens.type === ret.types.GROUP;
        var newBuild = [];

        if(tokens.options) {
            var options = tokens.options;
            for(var i = 0; i < options.length; ++i) {
                pushArray(newBuild, this._generate(options[i], build));
            }
            build = newBuild;
        } else {
            var stack = isGroup ? tokens.stack : tokens;
            for(var i = 0; i < stack.length; ++i) {
                var currentToken = stack[i];
                newBuild = [];
                switch (currentToken.type) {
                    case ret.types.CHAR:
                        var str = String.fromCharCode(currentToken.value);
                        pushArray(newBuild, build.map(a => a + str));
                        break;
                    case ret.types.GROUP:
                        pushArray(newBuild, this._generate(currentToken, build));
                        break;
                    case ret.types.SET:
                        // TODO
                        break;
                    case ret.types.RANGE:
                        for (var j = currentToken.from; j <= currentToken.to; ++j) {
                            var currentChar = String.fromCharCode(j);
                            pushArray(newBuild, build.map(elem => elem + currentChar));
                        }
                        break;
                    case ret.types.REPETITION:
                        j = 0;
                        for(; j < currentToken.min; ++j) {
                            build = newBuild = this._generate([currentToken.value], build);
                        }

                        // from min to max
                        for(; j < currentToken.max; ++j) {
                            pushArray(newBuild, this._generate([currentToken.value], newBuild));
                        }

                        newBuild = newBuild.filter((x, i, a) => a.indexOf(x) === i);
                        break;
                    default:
                        throw new Error('Unsupported type:', currentToken.type);
                }

                build = newBuild;
            }
        }

        return build;
    }
}
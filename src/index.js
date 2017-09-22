import ret from 'ret';
import {createCharMap, pushArray, createRegexpMap} from './utils';

/**
 * @class Generator
 */
export default class Generator {
    constructor(regexp, options = {}) {
        var {
            infSize = 10,
            charSet = /[a-z]/
        } = options;

        this.tokens = ret(regexp.source);
        this.infSize = infSize;
        var tokens = ret(charSet.source);
        if (tokens.stack[0].set) {
            this.charMap = createRegexpMap(tokens.stack[0].set);
        } else {
            this.charMap = createCharMap(tokens.stack);
        }
    }

    generate() {
        return this._generate(this.tokens, ['']);
    }

    _generate(tokens, build) {
        var isGroup = tokens.type === ret.types.ROOT || tokens.type === ret.types.GROUP;
        var newBuild = [];

        if (tokens.options) {
            var options = tokens.options;
            for (var i = 0; i < options.length; ++i) {
                pushArray(newBuild, this._generate(options[i], build));
            }
            build = newBuild;
        } else {
            var stack = isGroup ? tokens.stack : tokens;
            for (i = 0; i < stack.length; ++i) {
                var currentToken = stack[i];
                newBuild = [];
                switch (currentToken.type) {
                    case ret.types.CHAR:
                        var str = String.fromCharCode(currentToken.value);
                        pushArray(newBuild, build.map(a => a + str));
                        break;
                    case ret.types.SET:
                        var tokenSet;
                        if (currentToken.not) {
                            var currentTokenMap = createRegexpMap(currentToken.set);
                            var universe = Object.keys(this.charMap);
                            var availableTokens = [];
                            for (var j = 0; j < universe.length; ++j) {
                                var universeToken = universe[j];
                                if (currentTokenMap[universeToken] === undefined) {
                                    availableTokens.push(this.charMap[universeToken]);
                                }
                            }
                            tokenSet = availableTokens;
                        } else {
                            tokenSet = currentToken.set;
                        }

                        for (j = 0; j < tokenSet.length; ++j) {
                            pushArray(newBuild, this._generate([tokenSet[j]], build));
                        }
                        break;
                    case ret.types.GROUP:
                        pushArray(newBuild, this._generate(currentToken, build));
                        break;
                    case ret.types.RANGE:
                        for (j = currentToken.from; j <= currentToken.to; ++j) {
                            var currentChar = String.fromCharCode(j);
                            pushArray(newBuild, build.map(elem => elem + currentChar));
                        }
                        break;
                    case ret.types.REPETITION:
                        j = 0;
                        if (currentToken.min === 0) {
                            newBuild = build
                        } else {
                            for (; j < currentToken.min; ++j) {
                                build = newBuild = this._generate([currentToken.value], build);
                            }
                        }

                        // from min to max
                        var max = currentToken.max !== Infinity ? currentToken.max : this.infSize;
                        for (; j < max; ++j) {
                            pushArray(newBuild, this._generate([currentToken.value], newBuild));
                        }

                        newBuild = Array.from(new Set(newBuild));
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

import ret from 'ret';
import {createCharMap, pushArray, createRegexpMap} from './utils';

/**
 * Function that generates all possible strings given a regular expression.
 * @param {string|regexp} regexp - regular expression to use
 * @param {object} options
 * @param {regexp} [options.universe=/[a-z]/] - universe of letters allowed for the 'not' operator.
 * @param {number} [options.maxSize=10] - max string size of the generated output.
 * @return {Array} - generated string given the regular expression.
 */
export default function enumerateRegExp(regexp, options = {}) {
    var {
        maxSize = 10,
        universe = /[a-z]/
    } = options;

    var source = typeof regexp === 'string' ? regexp : regexp.source;
    var tokens = ret(source);

    var charSetTokens = ret(universe.source);

    if (charSetTokens.stack[0].set) {
        var charMap = createRegexpMap(charSetTokens.stack[0].set);
    } else {
        charMap = createCharMap(charSetTokens.stack);
    }

    return generate(tokens, [''], {
        tokens: tokens,
        charMap: charMap,
        infSize: maxSize
    });
}

/**
 * @private
 * Generate recursively all the possible string from the given tokens.
 * @param {object} tokens - current regexp tokens to process.
 * @param {Array} build - array of strings build until the current recursive call.
 * @param {object} common - common elements for each recursive call.
 * @return {Array} - current possible combination given the build.
 */

function generate(tokens, build, common) {
    var isGroup = tokens.type === ret.types.ROOT || tokens.type === ret.types.GROUP;
    var newBuild = [];

    if (tokens.options) {
        var options = tokens.options;
        for (var i = 0; i < options.length; ++i) {
            pushArray(newBuild, generate(options[i], build, common));
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
                        var universe = Object.keys(common.charMap);
                        var availableTokens = [];
                        for (var j = 0; j < universe.length; ++j) {
                            var universeToken = universe[j];
                            if (currentTokenMap[universeToken] === undefined) {
                                availableTokens.push(common.charMap[universeToken]);
                            }
                        }
                        tokenSet = availableTokens;
                    } else {
                        tokenSet = currentToken.set;
                    }

                    for (j = 0; j < tokenSet.length; ++j) {
                        pushArray(newBuild, generate([tokenSet[j]], build, common));
                    }
                    break;
                case ret.types.GROUP:
                    pushArray(newBuild, generate(currentToken, build, common));
                    break;
                case ret.types.RANGE:
                    for (j = currentToken.from; j <= currentToken.to; ++j) {
                        var currentChar = String.fromCharCode(j);
                        pushArray(newBuild, build.map(elem => elem + currentChar));
                    }
                    break;
                case ret.types.REPETITION:
                    j = 0;
                    newBuild = build;
                    for (; j < currentToken.min; ++j) {
                        build = newBuild = generate([currentToken.value], build, common);
                    }

                    // from min to max
                    var max = currentToken.max !== Infinity ? currentToken.max : common.infSize;
                    for (; j < max; ++j) {
                        pushArray(newBuild, generate([currentToken.value], newBuild, common));
                    }

                    newBuild = Array.from(new Set(newBuild));
                    break;
                case ret.types.POSITION:
                    // case for '$' '^', don't touch the previous build
                    continue;
                default:
                    throw new Error('Unsupported type:', currentToken.type);
            }

            build = newBuild;
        }
    }

    return build;
}

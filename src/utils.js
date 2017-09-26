import ret from 'ret';

const allowedTypes = [ret.types.CHAR];
const call = {};
call[ret.types.CHAR] = onChar;

export function createCharMap(tokens) {
    var map = {};
    for (var i = 0; i < tokens.length; ++i) {
        var currentToken = tokens[i];
        if (allowedTypes.indexOf(currentToken.type) === -1) {
            throw new RangeError('universe must be a regexp of letters');
        }

        call[currentToken.type](map, currentToken);
    }

    return map;
}

// only support chars and ranges
export function createRegexpMap(set) {
    var map = {};
    for (var i = 0; i < set.length; ++i) {
        var currentToken = set[i];
        switch (currentToken.type) {
            case ret.types.CHAR:
                map[currentToken.value] = currentToken;
                break;
            case ret.types.RANGE:
                for (var j = currentToken.from; j <= currentToken.to; ++j) {
                    map[j] = {
                        type: ret.types.CHAR,
                        value: j
                    };
                }
                break;
            default:
        }
    }

    return map;
}

export function pushArray(arr, toPush) {
    for (var i = 0; i < toPush.length; ++i) {
        arr.push(toPush[i]);
    }
}

function onChar(map, token) {
    map[token.value] = token;
}

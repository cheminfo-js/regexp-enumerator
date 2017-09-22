import ret from 'ret';

const allowedTypes = [ret.types.CHAR];
const call = {};
call[ret.types.CHAR] = onChar;

export function checkCharSet(charSet) {
    var tokens = charSet.stack;
    var set = new Set();
    for(var i = 0; i < set.length; ++i) {
        var currentToken = tokens[i];
        if(!allowedTypes.includes(currentToken.type)) {
            throw new RangeError('charSet must be a regexp of letters!');
        }

        call[currentToken.type](set, currentToken);
    }

    return set;
}

export function pushArray(arr, toPush) {
    for(var i = 0; i < toPush.length; ++i) {
        arr.push(toPush[i]);
    }
}

function onChar(set, token) {
    set.add(token.value);
}
import {generateRegExp as generate} from '..';

describe('test generator', () => {
    it('Recursive pipes and groups', () => {
        var output = generate(/a(b|c(d)|e(f|d))b(g|h)/).sort();
        var expected = ['abbg', 'abbh', 'acdbg', 'acdbh', 'aedbg', 'aedbh', 'aefbg', 'aefbh'];

        expect(output).toEqual(expected);
    });

    it('Repetitions with min value', () => {
        var output = generate(/(a|b){3}/, {}).sort();
        var expected = ['aaa', 'aab', 'aba', 'abb', 'baa', 'bab', 'bba', 'bbb'];

        expect(output).toEqual(expected);
    });

    it('Repetitions with min and max value', () => {
        var output = generate(/(a|b){1,2}/, {}).sort();
        var expected = ['a', 'aa', 'ab', 'b', 'ba', 'bb'];

        expect(output).toEqual(expected);
    });

    it('Star operator', () => {
        var output = generate(/a*/, {
            maxSize: 3
        }).sort();
        var expected = ['', 'a', 'aa', 'aaa'];
        expect(output).toEqual(expected);
    });

    it('Plus operator', () => {
        var output = generate(/a+/, {
            maxSize: 3
        }).sort();
        var expected = ['a', 'aa', 'aaa'];
        expect(output).toEqual(expected);
    });

    it('simple universe test', () => {
        var output = generate(/[^ab]/, {
            universe: /abcd/
        });
        expect(output).toEqual(['c', 'd']);
    });

    it('Set operator', () => {
        var output = generate(/[ab]*/, {
            maxSize: 3,
            universe: /[a-f]/
        }).sort();
        var expected = ['', 'a', 'aa', 'aaa', 'aab', 'ab', 'aba', 'abb', 'b', 'ba', 'baa', 'bab', 'bb', 'bba', 'bbb'];
        expect(output).toEqual(expected);
    });

    it('Range test', () => {
        var output = generate(/[a-c]/, {});
        expect(output).toEqual(['a', 'b', 'c']);
    });

    it('Set with negate operator', () => {
        var output = generate(/[^ab]*/, {
            maxSize: 2,
            universe: /[a-f]/
        }).sort();
        var expected = ['',
            'c',
            'cc',
            'cd',
            'ce',
            'cf',
            'd',
            'dc',
            'dd',
            'de',
            'df',
            'e',
            'ec',
            'ed',
            'ee',
            'ef',
            'f',
            'fc',
            'fd',
            'fe',
            'ff'];
        expect(output).toEqual(expected);
    });

    it('? operator', () => {
        var output = generate(/ab?c?/, {
            maxSize: 2,
            universe: /[a-f]/
        }).sort();
        var expected = ['a', 'ab', 'abc', 'ac'];
        expect(output).toEqual(expected);
    });

    it('No errors on $, ^, \\b, \\B operators', () => {
        var output = generate('^[ab]$', {});
        var expected = ['a', 'b'];
        expect(output).toEqual(expected);
    });

    it('throw error on bad selected universe', () => {

        expect(() => generate('[ab]', {
                universe: /a{1,3}/
            })).toThrow(RangeError);
    })
});

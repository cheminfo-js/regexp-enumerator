import Generator from '..';

describe('test generator', () => {
    it('Recursive pipes and groups', () => {
        var gen = new Generator(/a(b|c(d)|e(f|d))b(g|h)/);
        var output = gen.generate().sort();
        var expected = ['abbg',
            'abbh',
            'acdbg',
            'acdbh',
            'aedbg',
            'aedbh',
            'aefbg',
            'aefbh'];

        expect(output).toEqual(expected);
    });

    it('Repetitions with min value', () => {
        var gen = new Generator(/(a|b){3}/, {});
        var output = gen.generate().sort();
        var expected = ['aaa', 'aab', 'aba', 'abb', 'baa', 'bab', 'bba', 'bbb'];

        expect(output).toEqual(expected);
    });

    it('Repetitions with min and max value', () => {
        var gen = new Generator(/(a|b){1,2}/, {});
        var output = gen.generate().sort();
        var expected = ['a', 'aa', 'ab', 'b', 'ba', 'bb'];

        expect(output).toEqual(expected);
    });

    it('Star operator', () => {
        var gen = new Generator(/a*/, {
            infSize: 3
        });
        var output = gen.generate().sort();
        var expected = ['', 'a', 'aa', 'aaa'];
        expect(output).toEqual(expected);
    });

    it('Plus operator', () => {
        var gen = new Generator(/a+/, {
            infSize: 3
        });
        var output = gen.generate().sort();
        var expected = ['a', 'aa', 'aaa'];
        expect(output).toEqual(expected);
    });

    it('Set generator', () => {
        var gen = new Generator(/[^ab]*/, {
            infSize: 2,
            charSet: /[a-f]/
        });
        var output = gen.generate().sort();
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
});

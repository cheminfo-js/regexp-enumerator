import Generator from '..';
import {} from '';

describe('test generator', () => {
    it('Recursive pipes and groups', () => {
        var gen = new Generator(/a(b|c(d)|e(f|d))b(g|h)/);
        var output = gen.generate().sort();
        var expected = ['a(b)b(g)', 'a(b)b(h)', 'a(c(d))b(g)', 'a(c(d))b(h)', 'a(e(d))b(g)', 'a(e(d))b(h)', 'a(e(f))b(g)', 'a(e(f))b(h)'];

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

    it('Set operator', () => {
        var gen = new Generator(/[ab]*/, {
            infSize: 3,
            charSet: /[a-f]/
        });
        var output = gen.generate().sort();
        var expected = ['', 'a', 'aa', 'aaa', 'aab', 'ab', 'aba', 'abb', 'b', 'ba', 'baa', 'bab', 'bb', 'bba', 'bbb'];
        expect(output).toEqual(expected);

    });

    it('Set with negate operator', () => {
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

    it('? operator', () => {
        var gen = new Generator(/ab?c?/, {
            infSize: 2,
            charSet: /[a-f]/
        });
        var output = gen.generate().sort();
        var expected = ['a', 'ab', 'abc', 'ac'];
        expect(output).toEqual(expected);
    });

    it('Molecule samples', () => {
        var input = [
            /HSer(H-1PO3|)OH/,
            /HAla(H-1PO3|)Gly(H-1PO3|)Pro(H-1PO3|)OH/,
            /HCys(H-1Cys(Gly|Ala)|Ala)OH/,
            "HCys(C(Gly|Ala10)|C{50,50}|C{90,10})OH"
        ];

        var expectedOutput = [
            // case 1
            ['HSer(H-1PO3)OH', 'HSerOH'],
            // case 2
            ['HAla(H-1PO3)Gly(H-1PO3)Pro(H-1PO3)OH',
                'HAla(H-1PO3)Gly(H-1PO3)ProOH',
                'HAla(H-1PO3)GlyPro(H-1PO3)OH',
                'HAla(H-1PO3)GlyProOH',
                'HAlaGly(H-1PO3)Pro(H-1PO3)OH',
                'HAlaGly(H-1PO3)ProOH',
                'HAlaGlyPro(H-1PO3)OH',
                'HAlaGlyProOH'],
            // case 3
            [ 'HCys(Ala)OH', 'HCys(H-1Cys(Ala))OH', 'HCys(H-1Cys(Gly))OH' ],
            // case 4
            ['HCys(C(Ala10))OH',
                'HCys(C(Gly))OH',
                'HCys(C{50,50})OH',
                'HCys(C{90,10})OH']
        ];

        for(var i = 0; i < input.length; ++i) {
            expect(new Generator(input[i]).generate().sort()).toEqual(expectedOutput[i]);
        }
    })
});

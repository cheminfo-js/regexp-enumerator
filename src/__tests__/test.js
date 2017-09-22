import Generator from '..';

describe('test generator', () => {
    it('Recursive pipes and groups', () => {
        var gen = new Generator(/a(b|c(d)|e(f|d))b(g|h)/, {});
        var output = gen.generate().sort();
        var expected = [ 'abbg',
            'abbh',
            'acdbg',
            'acdbh',
            'aedbg',
            'aedbh',
            'aefbg',
            'aefbh' ];

        expect(output).toEqual(expected);
    });
});

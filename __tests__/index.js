const stylelint = require('stylelint');
const config = require('..');

const validCss = (
    `@import url('x.css');
@import url('y.css');

/**
 * Multi-line comment
 */
.selector-1,
.selector-2,
.selector-3[type='text'] {
    display: block;
    box-sizing: border-box;
    color: #333333;
    background: linear-gradient(#ffffff, rgb(0 0 0 / 0.8));
}

.selector-a,
.selector-b:not(:first-child) {
    top: calc(calc(1em * 2) / 3);
    padding: 10px !important;
}

.selector-x {
    width: 10%;
}

.selector-y {
    width: 20%;
}

.selector-z {
    width: 30%;
}

/* Single-line comment */
@media (min-width >= 60em) {
    .selector {
        /* Flush to parent comment */
        transform: translate(1, 1) scale(3);
    }
}
@media (orientation: portrait), projection and (color) {
    .selector-i + .selector-ii {
        font-family: helvetica, 'arial black', sans-serif;
        background: color(rgb(0 0 0) lightness(50%));
    }
}

/* Flush single line comment */
@media screen and (min-resolution: 192dpi), screen and (min-resolution: 2dppx) {
    .selector {
        height: 10rem;
        margin: 10px;
        margin-bottom: 5px;
        background-image: repeating-linear-gradient(-45deg, transparent, #ffffff 25px, rgb(255 255 255 / 1) 50px);
        box-shadow: 0 1px 1px #000000, 0 1px 0 #ffffff, 2px 2px 1px 1px #cccccc inset;
    }

    /* Flush nested single line comment */
    .selector::after {
        content: '→';
        background-image: url('x.svg');
    }
}
`);

const invalidCss = (
    `a {
    top: .2em;
}
`);

describe('flags no warnings with valid css', () => {
    let result;

    beforeEach(() => {
        result = stylelint.lint({
            code: validCss,
            config
        });
    });

    it('did not error', () => result.then(data => expect(data.errored).toBeFalsy()));

    it('flags no warnings', () => result.then(data => (
        expect(data.results[0].warnings.length).toBe(0)
    )));
});

describe('flags warnings with invalid css', () => {
    let result;

    beforeEach(() => {
        result = stylelint.lint({
            code: invalidCss,
            config
        });
    });

    it('did error', () => result.then(data => (
        expect(data.errored).toBeTruthy()
    )));

    it('flags one warning', () => result.then(data => (
        expect(data.results[0].warnings.length).toBe(1)
    )));

    it('correct warning text', () => result.then(data => (
        expect(data.results[0].warnings[0].text).toBe('Expected a leading zero (number-leading-zero)')
    )));

    it('correct rule flagged', () => result.then(data => (
        expect(data.results[0].warnings[0].rule).toBe('number-leading-zero')
    )));

    it('correct severity flagged', () => result.then(data => (
        expect(data.results[0].warnings[0].severity).toBe('error')
    )));

    it('correct line number', () => result.then(data => (
        expect(data.results[0].warnings[0].line).toBe(2)
    )));

    it('correct column number', () => result.then(data => (
        expect(data.results[0].warnings[0].column).toBe(10)
    )));
});

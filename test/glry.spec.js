const expect = require('chai').expect;
const jsdom = require('mocha-jsdom');
const sandbox = require('sinon').createSandbox();

const { Glry } = require('../glry');

describe('glry', function () {
    jsdom({
        url: 'http://localhost/',
    })
    
    let elm, nav, glry, options;

    function createElement(tag, props, child) {
        var elm = document.createElement(tag);
        for (var key in props) {
            elm.setAttribute(key, props[key]);
        }
        if (child) elm.appendChild(child);
        return elm;
    }

    function createEvent(eventName) {
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return e;
    }

    before(function () {
        elm = createElement('figure', {'id': 'figure'});
        elm.appendChild(createElement('div', {'class': 'loading'}));
        elm.appendChild(createElement('div', {'class': 'error'}));
        nav = createElement('nav', {'class': 'navigation'});
        nav.appendChild(createElement('button', {'class': 'prev'}));
        nav.appendChild(createElement('button', {'class': 'next'}));
        elm.appendChild(nav);
        document.body.appendChild(elm);

        options = {
            animationSpeed: 0,
            load: () => 'base/test/test1.jpg',
        };
    });

    afterEach(function () {
        sandbox.restore();
    });

    after(function () {
        elm.parentNode.removeChild(elm);
        elm = null;
    });

    it('should load image on init', function (done) {
        sandbox.spy(options, 'load');
        options.onLoadEnd = function () {
            expect(options.load.calls.count()).to.eql(1);
            expect(options.load).to.have.been.calledWith(undefined);
            done();
        };
        glry = new Glry(options);
    });

    it('should show error', function (done) {
        sandbox.stub(options, 'load').returns('invalid.jpg');
        options.onLoadEnd = function () {
            expect(elm.querySelector('.error').classList.contains('hidden')).to.be.false    ;
            done();
        };
        glry = new Glry(options);
    });

    it('should load next', function (done) {
        sandbox.spy(options, 'load');
        options.onLoadEnd = function () {
            elm.querySelector('.next').dispatchEvent(createEvent('mouseup'));
            expect(options.load.calls.count()).to.eql(2);
            expect(options.load).to.have.been.calledWith('right');
            done();
        };
        glry = new Glry(options);
    });

});
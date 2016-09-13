describe('glry', function () {
    var elm, nav, glry, options;

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

    beforeAll(function () {
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
            load: function (directions) {
                return 'base/test/test1.jpg';
            }
        };
    });

    afterAll(function () {
        elm.parentNode.removeChild(elm);
        elm = null;
    });

    it('should load image on init', function (done) {
        spyOn(options, 'load').and.callThrough();
        options.onLoadEnd = function () {
            expect(options.load.calls.count()).toEqual(1);
            expect(options.load).toHaveBeenCalledWith(undefined);
            done();
        };
        glry = new Glry(options);
    });

    it('should show error', function (done) {
        spyOn(options, 'load').and.returnValue('invalid.jpg');
        options.onLoadEnd = function () {
            expect(elm.querySelector('.error').classList.contains('hidden')).toBeFalsy();
            done();
        };
        glry = new Glry(options);
    });

    it('should load next', function (done) {
        spyOn(options, 'load').and.callThrough();
        options.onLoadEnd = function () {
            elm.querySelector('.next').dispatchEvent(createEvent('mouseup'));
            expect(options.load.calls.count()).toEqual(2);
            expect(options.load).toHaveBeenCalledWith('right');
            done();
        };
        glry = new Glry(options);
    });

});
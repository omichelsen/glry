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
            load: function (direction) {
                if (direction === 'left')
                    return 'prev-image.jpg';
                else
                    return 'next-image.jpg';
            }
        };
    });

    beforeEach(function () {
        spyOn(options, 'load').and.callThrough();
    });

    afterAll(function () {
        elm.parentNode.removeChild(elm);
        elm = null;
    });

    it('should load image on init', function () {
        glry = new Glry(options);
        expect(options.load).toHaveBeenCalledWith(undefined);
    });

    it('should show error', function (done) {
        options.onLoadEnd = function () {
            expect(elm.querySelector('.error').style.display).toEqual('block');
            done();
        };
        glry = new Glry(options);
    });

    it('should load next', function (done) {
        options.onLoadEnd = function () {
            var next = elm.querySelector('.next');
            next.dispatchEvent(createEvent('mouseup'));
            expect(options.load.calls.count()).toEqual(2);
            expect(options.load).toHaveBeenCalledWith('right');
            done();
        };
        glry = new Glry(options);
    });

});
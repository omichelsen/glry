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

    beforeEach(function () {
        elm = createElement('figure', {'id': 'figure'});
        elm.appendChild(createElement('div', {'class': 'loading'}));
        elm.appendChild(createElement('div', {'class': 'error'}));
        nav = createElement('nav', {'class': 'navigation'});
        nav.appendChild(createElement('button', {'class': 'prev'}));
        nav.appendChild(createElement('button', {'class': 'next'}));
        elm.appendChild(nav);
        document.body.appendChild(elm);

        options = {
            load: function (direction) {
                if (direction === 'left')
                    return 'prev-image.jpg';
                else
                    return 'next-image.jpg';
            }
        };

        spyOn(options, 'load');

        glry = new Glry(options);
    });

    afterEach(function () {
        elm.parentNode.removeChild(elm);
        elm = null;
    });

    it('should load image', function () {
        expect(options.load).toHaveBeenCalled();
    });

});
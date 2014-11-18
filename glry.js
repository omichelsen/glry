/*!
 * glry v0.2.0 (https://github.com/omichelsen/glry)
 * Copyright 2014 Ole Michelsen <ole@michelsen.dk>
 * Licensed under MIT
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Glry = factory();
    }
}(this, function () {
    'use strict';

    function cssPrefix() {
        var s = (document.body || document.documentElement).style;
        if (s.WebkitTransform == '') return '-webkit-';
        return '';
    }

    function cssTranslateX(element, positionX, speed) {
        var options = {},
            prefix = cssPrefix();
        options[prefix + 'transform'] = 'translateX(' + positionX + ')';
        options[prefix + 'transition'] = prefix + 'transform ' + speed + 's linear, opacity ' + speed + 's linear';
        extend(element.style, options);
    }

    function extend(target, source) {
        if (typeof source !== 'object') return target;
        for (var prop in source) {
            target[prop] = source[prop];
        }
        return target;
    }

    function Glry(options) {
        var options = extend({
                    target: '#figure',
                    animationSpeed: 250,
                    enableKeyboard: true,
                    onLoadStart: false,
                    onLoadEnd: false,
                    load: function () {}
                },
                options),

            elmContainer = typeof options.target === 'object' ? options.target : document.querySelector(options.target),
            elmNavigation = elmContainer.querySelector('.navigation'),
            elmLoading = elmContainer.querySelector('.loading'),
            elmError = elmContainer.querySelector('.error'),
            image = null,
            imageWidth = 0,
            imageHeight = 0,
            swipeDiff = 0,
            inProgress = false;

        window.addEventListener('resize', setImage);
        window.addEventListener('touchstart', handleScrolling);
        window.addEventListener('touchmove', handleScrolling);

        if (elmNavigation) {
            window.addEventListener('mousemove', handleNavigation());
        }

        if (options.enableKeyboard) {
            window.addEventListener('keyup', handleKeyboard);
        }

        loadImage();

        function setImage() {
            if (!image) return true;

            window.scrollTo(0, 0);

            var screenWidth = window.innerWidth,
                screenHeight = window.innerHeight,
                tmpImage = new Image();

            tmpImage.src = image.src;
            tmpImage.onload = function () {
                imageWidth = tmpImage.width;
                imageHeight = tmpImage.height;

                if (imageWidth > screenWidth || imageHeight > screenHeight) {
                    var ratio = imageWidth / imageHeight > screenWidth / screenHeight ? imageWidth / screenWidth : imageHeight / screenHeight;
                    imageWidth /= ratio;
                    imageHeight /= ratio;
                }

                extend(image.style, {
                    'width': imageWidth + 'px',
                    'height': imageHeight + 'px',
                    'top': (window.innerHeight - imageHeight) / 2 + 'px',
                    'left': (window.innerWidth - imageWidth) / 2 + 'px'
                });
            };
        }

        function loadImage(direction) {
            if (inProgress) return false;

            var src = options.load(direction);
            if (!src) return false;

            direction = direction === 'left' ? 1 : direction === 'right' ? -1 : 0;

            if (image) {
                image.style.opacity = 0;
                cssTranslateX(image, (100 * direction) - swipeDiff + 'px', options.animationSpeed / 1000);
                setTimeout(removeImage, options.animationSpeed);
                swipeDiff = 0;
            }

            inProgress = true;
            elmLoading.style.display = 'block';
            elmError.style.display = 'none';
            if (options.onLoadStart !== false) options.onLoadStart();

            setTimeout(function () {
                image = document.createElement('img');
                image.src = src;
                image.onload = function () {
                    elmContainer.appendChild(image);
                    setImage();

                    image.style.opacity = 0;
                    cssTranslateX(image, -100 * direction + 'px', 0);
                    setTimeout(function () {
                        image.style.opacity = 1;
                        cssTranslateX(image, 0 + 'px', options.animationSpeed / 1000)
                    }, 50);

                    setTimeout(function () {
                        inProgress = false;
                        elmLoading.style.display = 'none';
                        if (options.onLoadEnd !== false) options.onLoadEnd();
                    }, options.animationSpeed);
                };
                image.onerror = function (e) {
                    inProgress = false;
                    elmLoading.style.display = 'none';
                    elmError.style.display = 'block';
                    if (options.onLoadEnd !== false) options.onLoadEnd();
                };

                var swipeStart = 0,
                    swipeEnd = 0,
                    imagePosLeft = 0;

                image.addEventListener('touchstart', function (e) {
                    imagePosLeft = parseInt(image.style.left);
                    swipeStart = e.pageX || e.touches[0].pageX;
                });

                image.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                    swipeEnd = e.pageX || e.touches[0].pageX;
                    swipeDiff = swipeStart - swipeEnd;
                    cssTranslateX(image, -swipeDiff + 'px', 0);
                });

                image.addEventListener('touchend', function (e) {
                    if (Math.abs(swipeDiff) > 50) {
                        loadImage(swipeDiff > 0 ? 'right' : 'left');
                    } else {
                        cssTranslateX(image, 0 + 'px', options.animationSpeed / 1000);
                    }
                });

            }, options.animationSpeed + 100);
        }

        function removeImage() {
            if (!image || !image.parentNode) return false;
            image.parentNode.removeChild(image);
            image = null;
        }

        function handleNavigation() {
            var timeout;
            return function (e) {
                clearTimeout(timeout);
                elmNavigation.style.opacity = 1;
                if (e.target != elmNavigation) {
                    timeout = setTimeout(function () {
                        elmNavigation.style.opacity = 0;
                    }, 1500);
                }
            };
        }

        function handleKeyboard(e) {
            e.preventDefault();
            if (e.keyCode === 37 || e.keyCode === 39) {
                loadImage(e.keyCode === 37 ? 'left' : 'right');
            }
        }

        function handleScrolling(e) {
            e.preventDefault();
        }

        return {
            loadImage: loadImage
        };
    };

    return Glry;

}));

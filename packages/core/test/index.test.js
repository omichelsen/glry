const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');
const sinon = require('sinon');
const Glry = require('../src/index.js');

describe('@glry/core', () => {
	let dom;

	before(async () => {
		dom = await JSDOM.fromFile(path.resolve('test/test.html'));
		global.window = dom.window;
		global.document = dom.window.document;
	});

	const runTest = (loadFake, callback) => {
		new Glry({
			animationSpeed: 0,
			load: loadFake,
			onLoadEnd: callback,
		});
	};

	it('should load image on init', (done) => {
		const load = sinon.fake.returns('base/test/test1.jpg');
		runTest(load, () => {
			assert.equal(load.calls.count(), 1);
			assert(load.calledWith(undefined));
			done();
		});
	});

	it('should show error', (done) => {
		const load = sinon.fake.returns('invalid.jpg');
		runTest(load, () => {
			expect(
				document.querySelector('.error').classList.contains('hidden')
			).toBeFalsy();
			done();
		});
	});

	it('should load next', function (done) {
		const load = sinon.fake.returns('invalid.jpg');
		runTest(load, () => {
			document
				.querySelector('.next')
				.dispatchEvent(new dom.window.Event('mouseup'));
			assert.equal(load.calls.count(), 2);
			assert(load.calledWith('right'));
			done();
		});
	});
});

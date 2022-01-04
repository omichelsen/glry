import DailyGlry from '../src/index.js';

const dailyGlry = new DailyGlry({
	dateMin: new Date(1989, 4, 16),
	host: 'https://dilbert.michelsen.dk/archive/',
	extension: '.gif',
});

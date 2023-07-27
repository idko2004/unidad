const cards = require('../utils/cards');

module.exports = function(dataObject, ws)
{
	console.log('---------------\ngetCardProperties\n');
	console.log(dataObject);

	ws.send(JSON.stringify(
	{
		operation: 'getCardProperties',
		properties: cards.properties
	}));
}
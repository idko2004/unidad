const debugAllowed = true;

const game = require('../utils/game');

module.exports = function(dataObject, ws)
{
	if(!debugAllowed) return;
	/*
	Requisitos:
	{
		operation: 'debug',
		debug: '' some debug thing
	}
	*/
	switch(dataObject.debug)
	{
		default:
			ws.send(JSON.stringify(
			{
				operation: 'debug',
				debug: 'invalid debug type'
			}))
			break;

		case 'activeGames':
			ws.send(JSON.stringify(
			{
				operation: 'debug',
				debug: game.activeGames
			}));
			break;
	}
}
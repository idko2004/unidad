const vars = require('../utils/env');

const debugAllowed = vars.env.DEBUG || '0';

const game = require('../utils/game');
const clients = require('../utils/wsClients');

module.exports = function(dataObject, ws)
{
	if(debugAllowed !== '1')
	{
		ws.send(JSON.stringify({operation: 'debug', debug: 'debug is not allowed'}));
		console.log('Debug is not allowed', debugAllowed);
		return;
	}
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
			console.log('invalid debug type');
			ws.send(JSON.stringify(
			{
				operation: 'debug',
				debug: 'invalid debug type'
			}))
			break;

		case 'activeGames':
			console.log('sending active games');
			ws.send(JSON.stringify(
			{
				operation: 'debug',
				debug: game.activeGames
			}));
			break;

		case 'wsclients':
			console.log('sending active clients');
			ws.send(JSON.stringify(
			{
				operation: 'debug',
				debug: clients.wsClients
			}));
			break;
	}
}

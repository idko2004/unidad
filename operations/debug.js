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
		debug: '' some debug thing,
		data: '' some extra thing
	}
	*/
	switch(dataObject.debug)
	{
		default:
			console.log('invalid debug type');
			ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error: 'invalid debug type'
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

		case 'player':
			console.log('sending information about a specific player');
			if(dataObject.data === undefined || !Array.isArray(dataObject.data))
			{
				ws.send(JSON.stringify(
				{
					operation: 'errorPlaying',
					error: 'No data was sent'
				}));
				return;
			}
			let player_roomID = dataObject.data[0];
			let player_playerName = dataObject.data[1];
			let player_room = game.activeGames[player_roomID];
			if(player_room === undefined)
			{
				ws.send(JSON.stringify(
				{
					operation: 'errorPlaying',
					error: 'invalidRoom'
				}));
				return;
			}

			let player_player = player_room.players[player_playerName];
			if(player_player === undefined)
			{
				ws.send(JSON.stringify(
				{
					operation: 'errorPlaying',
					error: 'invalidRoom'
				}));
				return;
			}

			let player_copy =
			{
				luck: player_player.luck,
				inactive: player_player.inactive,
				deck: player_player.deck,
				connected: player_player.ws !== null
			}
			if(player_player.ws !== null) player_copy.wsGameInfo = player_player.ws.gameInfo

			ws.send(JSON.stringify(
			{
				operation: 'debug',
				debug: player_copy
			}));
			break;

	}
}

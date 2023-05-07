
const game = require('../game');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'joinGame',
		username,
		roomID
	}
	Respuesta:
	{
		operation: 'joinedToGame',
		players:
		[
			
		]
	}
	*/
	console.log('---------------\njoinGame\n');

	let username = dataObject.username;
	let roomID = dataObject.roomID;

	if(username === undefined
	|| roomID === undefined
	|| typeof username !== 'string'
	|| typeof roomID !== 'string'
	|| username.trim() === ''
	|| username.length > 20)
	{
		console.log('Los requisitos no se cumplen');
		ws.send(JSON.stringify(
		{
			error: 'badRequest',
			operation: 'joinedToGame'
		}));
	}


	//Encontrar la sala
	roomID = roomID.trim();
	if(game.activeGames[roomID] === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'joinedToGame',
			error: 'cantFindRoom'
		}));
		return;
	}



	// Añadir usuario a la sala
	game.activeGames[roomID].players[username] =
	{
		deck:
		[
			'6b',
			'6b',
			'6b',
			'6b',
			'6b',
			'6b',
			'6b',
		],
		won: false,
		ws
	}




	// Obtener los nombres de los usuarios
	const players = Object.keys(game.activeGames[roomID].players);



	// Responder
	ws.send(JSON.stringify(
	{
		operation: 'joinedToGame',
		players
	}));
}


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
		roomID,
		players:
		[
			
		]
	}
	Respuesta para los demás:
	{
		operation: 'playerJoined',
		username
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
		roomID,
		players
	}));

	console.log(game.activeGames);


	// Avisar a los demás jugadores que se ha unido alguien
	for(let i = 0; i < players.length; i++)
	{
		const key = players[i];
		if(key === username) continue;

		const connection = game.activeGames[roomID].players[key].ws;

		connection.send(JSON.stringify(
		{
			operation: 'playerJoined',
			username
		}));
	}
}

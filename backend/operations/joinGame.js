
const game = require('../utils/game');

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
	const room = game.activeGames[roomID]
	if(room === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'joinedToGame',
			error: 'cantFindRoom'
		}));
		return;
	}



	// Ver si se puede entrar a la sala
	if(!room.letMorePlayersIn)
	{
		ws.send(JSON.stringify(
		{
			operation: 'joinedToGame',
			error: 'gameAlredyStarted'
		}));
		return;
	}



	// Obtener los nombres de los usuarios para usarlos más tarde
	const players = Object.keys(room.players);



	// Ver si la sala está llena
	if(players.length >= room.maxPlayers)
	{
		ws.send(JSON.stringify(
		{
			operation: 'joinedToGame',
			error: 'roomIsFull'
		}));
		return;
	}



	// Añadir usuario a la sala
	room.players[username] =
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

	players.push(username);



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

		const connection = room.players[key].ws;

		connection.send(JSON.stringify(
		{
			operation: 'playerJoined',
			username
		}));
	}
}

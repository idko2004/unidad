
const game = require('../utils/game');
const cards = require('../utils/cards');

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
	const room = game.activeGames[roomID];
	if(room === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'joinedToGame',
			error: 'cantFindRoom'
		}));
		return;
	}



	// Obtener los nombres de los usuarios para usarlos más tarde
	const players = Object.keys(room.players);



	//Si un jugador se ha desconectado de la partida y vuelve a conectarse antes de que su usuario de la mesa se borre.
	try
	{
		console.log(room.players[username].ws);
	}
	catch
	{
		console.log('No se pudo loguear el ws del jugador');
	}
	if(room.players[username] !== undefined && room.players[username].ws === null)
	{
		console.log('Un jugador con el mismo nombre existe en la sala y no tiene ws, se va a asumir que es el mismo jugador e intentar reconectarlo');
		
		ws.gameInfo.push(
		{
			username,
			roomID
		});

		room.players[username].ws = ws;

		ws.send(JSON.stringify(
		{
			operation: 'rejoined',
			roomID,
			players: room.order,
			deck: room.players[username].deck,
			currentCard: room.currentCard,
			yourTurn: room.order[room.whoIsPlaying] === username,
			message: ['Has vuelto a la partida']
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
		deck: cards.generateDeck(roomID),
		luck: 0.5,
		ws
	}

	players.push(username);



	ws.gameInfo.push(
	{
		username,
		roomID
	});



	// Responder
	ws.send(JSON.stringify(
	{
		operation: 'joinedToGame',
		roomID,
		players
	}));



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

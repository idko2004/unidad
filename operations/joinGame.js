
const game = require('../utils/game');
const cards = require('../utils/cards');

const rand = require('generate-key');

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
	if(room.players[username] !== undefined && room.players[username].ws === null)
	{
		console.log('Un jugador con el mismo nombre existe en la sala y no tiene ws, se va a asumir que es el mismo jugador e intentar reconectarlo');
		
		ws.gameInfo.push(
		{
			username,
			roomID
		});

		room.players[username].ws = ws;

		//Reasignar la clave
		const keysKeys = Object.keys(room.keys);
		const keysValues = Object.values(room.values);
		let userKey;
		
		for(let i = 0; i < keysValues.length; i++)
		{
			if(keysValues[i] === username)
			{
				previousKey = keysKeys[i];
				break;
			}
		}

		if(userKey === undefined) userKey = rand.generateKey(7); //No debería de ocurrir, pero por si acaso

		ws.send(JSON.stringify(
		{
			operation: 'rejoined',
			roomID,
			key: userKey,
			players: room.order,
			deck: room.players[username].deck,
			currentCard: room.currentCard,
			yourTurn: room.order[room.whoIsPlaying] === username,
			message: ['Has vuelto a la partida']
		}));
		return;
	}



	//Ver si un jugador con el mismo nombre ya existe
	if(players.includes(username))
	{
		ws.send(JSON.stringify(
		{
			operation: 'joinedToGame',
			error: 'invalidName'
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
		luck: 0.15,
		ws
	}
	room.players[username].deck = cards.generateDeck(roomID, username);

	players.push(username);



	//Darle una clave al usuario
	const key = rand.generateKey(7);
	room.keys[key] = username;



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
		key,
		players
	}));



	// Avisar a los demás jugadores que se ha unido alguien
	for(let i = 0; i < players.length; i++)
	{
		const player = players[i];
		if(player === username) continue;

		const connection = room.players[player].ws;

		connection.send(JSON.stringify(
		{
			operation: 'playerJoined',
			username
		}));
	}
}

const game = require('../utils/game');
const msg = require('../utils/messages');
const random = require('../utils/random');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'startGame',
		roomID,
		key
	}
	Enviar a todos:
	{
		operation: 'startGame',
		deck: [ Tus cartas ],
		currentCard,
		message
	}
	*/

	const roomID = dataObject.roomID;
	const key = dataObject.key;

	if([roomID, key].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'startGame',
			error: 'badRequest'
		}));
		console.log('startGame: badRequest: no roomID or key');
		return;
	}



	//Buscar si la sala existe
	const room = game.activeGames[roomID];
	if(room === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'startGame',
			error: 'badRequest'
		}));
		return;
	}



	// Obtener el nombre de usuario y comprobar si está en la sala
	const username = room.keys[key];
	if(username === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: el usuario no pertenece a la sala');
		return;
	}



	//Ver si el usuario es el gameMaster
	if(room.master !== username)
	{
		ws.send(JSON.stringify(
		{
			operation: 'startGame',
			error: 'badRequest'
		}));
		return;
	}




	//Ya no dejar que nadie más entre en la sala
	room.letMorePlayersIn = false;



	// Poner el orden de los jugadores y quien juega
	const players = Object.keys(room.players);
	
	room.order = players;
	room.whoIsPlaying = 0;




	//Avisar a todos los jugadores de que empezó el juego
	const currentCard = room.currentCard;

	for(let i = 0; i < players.length; i++)
	{
		const playerName = players[i];
		const playerProfile = room.players[playerName];

		const deck = playerProfile.deck;

		let message;
		let yourTurn = false;
		if(i === room.whoIsPlaying)
		{
			message = [msg.getMessage(msg.msgValues.yourTurn)];
			yourTurn = true;
		}
		else
		{
			message = [msg.getMessage(msg.msgValues.turn, {username: players[room.whoIsPlaying]})];
		}

		playerProfile.ws.send(JSON.stringify(
		{
			operation: 'startGame',
			deck,
			currentCard,
			message,
			yourTurn
		}));
	}
}
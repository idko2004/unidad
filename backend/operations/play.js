const game = require('../utils/game');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'play',
		username,
		roomID,
		play:
		{
			card
		}
	}
	Enviar a todos:
	{
		operation: 'gameUpdate',
		currentCard,
		deck: [],
		yourTurn: true | false
		messages:[]
	}
	*/



	//Comprobar si tenemos todos los datos
	const roomID = dataObject.roomID;
	const username = dataObject.username;
	if([roomID, username].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'badRequest'
		}));
		return;
	}



	// Comprobar si la sala existe
	const room = game.activeGames[roomID];
	if(room === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		return;
	}



	// Comprobar si el usuario es parte de la sala
	if(room.order.includes(username))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		return;
	}



	// Comprobar si es su turno
	if(room.order[room.whoIsPlaying] === username)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'notYourTurn'
		}));
		return;
	}



	// Si la carta jugada no es especial, hacer la cosa



	// Si la carta jugada es especial, hacer la cosa



	// Enviar el estado de la partida a todos los jugadores
}
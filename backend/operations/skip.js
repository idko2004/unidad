const game = require('../utils/game');
const cards = require('../utils/cards');

const colors = require('colors');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'skip',
		username,
		roomID
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
	console.log('---------------\nskip\n');
	console.log(dataObject);



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
		console.log('errorPlaying: badRequest: no roomID or username');
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
		console.log('errorPlaying: invalidRoom: la sala no existe');
		return;
	}



	// Comprobar que ya se agarró carta del mazo
	if(!room.cardGrabbed)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'grabCardFirst'
		}));
		console.log('errorPlaying: grabCardFirst: no se tomó una carta del mazo');
		return;
	}



	// Comprobar si el usuario es parte de la sala
	if(!room.order.includes(username))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: el usuario no pertenece a la sala');
		return;
	}



	// Comprobar si es su turno
	if(room.order[room.whoIsPlaying] !== username)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'notYourTurn'
		}));
		console.log('errorPlaying: notYourTurn');
		return;
	}



	// Saltar un turno
	game.utils.nextTurn(roomID);
	room.cardGrabbed = false;



	// Enviar el estado de la partida a todos los jugadores
	game.utils.updatePlayers(roomID);
}
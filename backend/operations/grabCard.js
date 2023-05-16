const game = require('../utils/game');
const cards = require('../utils/cards');

const colors = require('colors');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'grabCard',
		username,
		roomID
	}
	Enviar a todos:
	{
		operation: 'grabCard',
		card
	}
	*/
	console.log('---------------\ngrabCard\n');
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



	// Comprobar si ya no se tomó una carta en este turno
	if(room.cardGrabbed)
	{
		ws.send(JSON.stringify(
		{
			operation: 'grabCard',
			error: 'alredyGrabbed'
		}));
		console.log('grabCard: alredyGrabbed: ya se tomó una carta del mazo en este turno');
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



	// Elegir la carta que enviar
	const card = cards.getCard('all');
	room.players[username].deck.push(card);

	ws.send(JSON.stringify(
	{
		operation: 'grabCard',
		card
	}));
	console.log('Carta enviada');
}
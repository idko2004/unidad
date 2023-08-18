const game = require('../utils/game');
const cards = require('../utils/cards');

const colors = require('colors');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'grabCard',
		key,
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
	const key = dataObject.key;
	if([roomID, key].includes(undefined))
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



	if(room.cardsToVictim > 0)
	{
		ws.send(JSON.stringify(
		{
			operation: 'grabCard',
			error: 'alredyGrabbed'
		}));
		console.log('grabCard: alredyGrabbed: en realidad no se tomó una carta, pero está recibiendo cartas + por lo que no puede tomar cartas');
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



	/*
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
	*/



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
	const card = cards.getCard(roomID);
	room.players[username].deck.push(card);



	// Guardar que ya se tomó la carta
	room.cardGrabbed = true;

	ws.send(JSON.stringify(
	{
		operation: 'grabCard',
		card
	}));
	console.log('Carta enviada');
}
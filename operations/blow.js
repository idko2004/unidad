const game = require('../utils/game');
const cards = require('../utils/cards');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'blow'
		key,
		roomID,
		card
	}
	Respuesta:
	{
		operation: 'blowResponse'
		deck
	}
	*/

	const key = dataObject.key;
	const roomID = dataObject.roomID;
	const card = dataObject.card;

	if([key, roomID, card].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'badRequest'
		}));
		console.log('errorPlaying: badRequest: algunos datos eran undefined');
		return;
	}



	room = game.activeGames[roomID];
	if(room === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom');
		return;
	}



	//Comprobar si en esta sala se puede soplar
	if(!room.rules.blow)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'blowDisabled'
		}));
		console.log('errorPlaying: blowDisabled: soplar está desactivado en esta sala');
		return;
	}



	const username = room.keys[key];
	if(username === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: el usuario no pertenece a esa sala');
		return;
	}



	const player = room.players[username];
	if(player === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: no existe información del jugador (pero aparentemente sí una llave?)');
		return;
	}



	//Comprobamos si la carta es igual a la carta actual
	if(room.currentCard !== card)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		console.log('errorPlaying: invalidCard: esa no es la carta actual');
		return;
	}



	//Comprobamos si la carta no es una carta especial
	if([cards.cardTypes.moreSpecial, cards.cardTypes.special].includes(cards.properties[card].type))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'cantBlowSpecial'
		}));
		console.log('errorPlaying: invalidCard: no se pueden soplar cartas especiales');
		return;
	}



	// Comprobamos si la carta está en el mazo del jugador
	if(!player.deck.includes(card))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		console.log('errorPlaying: invalidCard: esa carta no está en el mazo del jugador');
		return;
	}



	//Quitar la carta del deck del jugador
	player.deck = cards.deleteFromDeck(card, player.deck);



	//Responder
	ws.send(JSON.stringify(
	{
		operation: 'blowResponse',
		deck: player.deck
	}));

	console.log(`${username} ha soplado un ${card}`);
}

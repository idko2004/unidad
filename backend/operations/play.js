const game = require('../utils/game');
const cards = require('../utils/cards');
const msg = require('../utils/messages');

const colors = require('colors');

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
	console.log('---------------\nplay\n');
	console.log(dataObject);



	//Comprobar si tenemos todos los datos
	const roomID = dataObject.roomID;
	const username = dataObject.username;
	const play = dataObject.play;
	if([roomID, username, play].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'badRequest'
		}));
		console.log('errorPlaying: badRequest:', roomID, username, play);
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
		console.log('errorPlaying: invalidRoom: la sala es undefined');
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



	// Obtener las propiedades de la carta
	const cardProperties = cards.properties[play.card];
	if(cardProperties === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		console.log('errorPlaying: invalidCard: la carta no existe');
		return;
	}



	// Comprobar si la carta es válida
	if(!cards.cardIsValid(play.card, room.currentCard))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		console.log('errorPlaying: invalidCard: la carta no es ni del mismo color ni valor');
		return;
	}



	// Comprobar si la carta está en el deck del jugador
	if(!room.players[username].deck.includes(play.card))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		console.log('errorPlaying: invalidCard: la carta no está en el mazo');
		return;
	}



	let messages = [];


	// Si la carta jugada es especial, hacer la cosa
	if(cardProperties.special)
	{
		switch(cardProperties.value)
		{
			default:
			ws.send(JSON.stringify(
				{
					operation: 'errorPlaying',
					error: 'not implemented yet'
				}));
				console.log('errorPlaying: not implemented yet: cartas especiales');
				return;

			case '+2':
				playPlusCard(2, dataObject, ws, room, messages);
				break;
			
			case '+4':
				playPlusCard(4, dataObject, ws, room, messages);
				break;
		}
	}



	// Si la carta no es especial pero hace algo, hacer la cosa
	else if(cardProperties.doesSomething)
	{
		if(room.cardsToVictim > 0) //Si te están tirando tremendo +4
		{
			let newCards = [];
			const cardsToVictim = room.cardsToVictim;
			for(let i = 0; i <= cardsToVictim; i++)
			{
				newCards.push(cards.getCard('all'));
			}

			room.players[username].deck.push(...newCards); //Añadir las cartas al mazo de la víctima
			room.cardsToVictim = 0; //Reiniciar el número de cartas para la siguiente víctima
			game.utils.nextTurn(roomID); //Pasar el turno al siguiente jugador
			messages.push(msg.getMessage(msg.msgValues.cardsEaten, //Mensaje de que la víctima se comió cartas
			{
				victim: username,
				cardsnumber: cardsToVictim
			}));
			game.utils.updatePlayers(roomID, messages); //Enviar el estado de la partida a todos los jugadores
			return;
		}

		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'not implemented yet'
		}));
		console.log('errorPlaying: not implemented yet: cartas no especiales que hacen cosas');
		return;
	}



	// Si la carta jugada no es especial, hacer la cosa
	else
	{
		if(room.cardsToVictim > 0) //Si te están tirando tremendo +4
		{
			messages.push(msg.getMessage(msg.msgValues.cardsEaten, //Mensaje de que la víctima se comió cartas
			{
				victim: username,
				cardsnumber: room.cardsToVictim
			}));
			cards.giveCardsToVictim(roomID, username); //Dar las cartas al jugador
			game.utils.nextTurn(roomID); //Pasar el turno al siguiente jugador
			game.utils.updatePlayers(roomID, messages); //Enviar el estado de la partida a todos los jugadores
			return;
		} //Si no te están tirando tremendo +4

		room.currentCard = play.card; //Actualizar la carta actual
		room.cardGrabbed = false; //Para que el jugador del turno siguiente pueda agarrar una carta del mazo
		room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck); //Quitar la carta jugada del mazo
		game.utils.nextTurn(roomID); //Pasar el turno al siguiente jugador
		messages.push(msg.getMessage(msg.msgValues.cardPlayed, //Mensaje de la jugada realizada
		{
			username,
			cardname: msg.cardNames[play.card]
		}));

		// Enviar el estado de la partida a todos los jugadores
		game.utils.updatePlayers(roomID, messages);
	}
}

function playPlusCard(howManyCards, dataObject, ws, room, messages)
{
	if([dataObject, ws, room, howManyCards].includes(undefined))
	{
		console.log(colors.red('play.playPlusTwoCard: alguno de los parámetros es undefined'));
		return;
	}
	console.log('Alguien va a recibir cartas');

	const play = dataObject.play;
	const username = dataObject.username;
	const roomID = dataObject.roomID;

	room.currentCard = play.card; //Actualizar la carta actual
	room.cardGrabbed = false; //Para que el jugador del turno siguiente pueda agarrar una carta del mazo
	room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck); //Quitar la carta jugada del mazo
	room.cardsToVictim += howManyCards; //Sumar las cartas que le van a caer a la víctima

	messages.push(msg.getMessage(msg.msgValues.accumuledCards, //Mensaje de la jugada
	{
		username,
		cardname: msg.cardNames[play.card],
		cardsnumber: room.cardsToVictim
	}));

	const victim = room.order[game.utils.whosNext(roomID)]; //Determinar quien va a ser la víctima que se lleve las cartas

	if(!cards.deckContainsSpecificsCards(
	[
		'+4', '+2r', '+2g', '+2y', '+2y', 'BLOCKr', 'BLOCKg', 'BLOCKb', 'BLOCKy'
	],room.players[victim].deck)) //Si la víctima no tiene cartas para defenderse
	{
		console.log('La victima no puede defenderse');

		messages.push(msg.getMessage(msg.msgValues.cardsEaten, //Mensaje de que la víctima se comió cartas
		{
			victim,
			cardsnumber: room.cardsToVictim
		}));

		cards.giveCardsToVictim(roomID, victim);

		//Cambiar de turno dos veces para saltar el turno de la víctima
		game.utils.nextTurn(roomID);

	}
	else console.log('Existen cartas defensivas en su mazo');
	//Si la víctima no tiene cartas para defenderse, debe recibir las cartas inmediatamente y su turno debe saltarse.
	//Pero, si la víctima es capaz de defenderse, debe hacerlo, de lo contrario, deberá de recibir las cartas

	game.utils.nextTurn(roomID); //Cambiar de turno dos veces para saltar el turno de la víctima
	game.utils.updatePlayers(roomID, messages);
}
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
		key,
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
	const key = dataObject.key;
	const play = dataObject.play;
	if([roomID, key, play].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'badRequest'
		}));
		console.log('errorPlaying: badRequest:', roomID, key, play);
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



	// Obtener nombre de usuario y comprobar si está en la sala
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
	dataObject.username = username; //Para que otras funciones puedan acceder al nombre de usuario, antes el nombre de usuario estaba incluido en el dataObject directamente y algunas funciones esperan que esté ahí



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

	// Si la carta jugada es más especial, hacer la cosa
	if(cardProperties.type === cards.cardTypes.moreSpecial)
	{
		if(room.players[username].deck.length === 1) // Si solo tiene una carta, es una carta especial y piensa ganar con ella, le damos un +2
		{
			cards.giveCardsToSomeone(roomID, username, 2);
		}

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

			case '+6':
				playPlusCard(6, dataObject, ws, room, messages);
				break;

			case 'BLANK':
				playNormalCard(dataObject, ws, room, messages);
				break;

			case '+1':
				playPlusOneCard(dataObject, ws, room, messages);
				break;
		}
	}



	// Si la carta jugada es especial, hacer la cosa
	else if(cardProperties.type === cards.cardTypes.special)
	{
		if(room.players[username].deck.length === 1) // Si solo tiene una carta, es una carta especial y piensa ganar con ella, le damos un +2
		{
			cards.giveCardsToSomeone(roomID, username, 2);
		}

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

			case 'BLOCK':
				playBlockCard(dataObject, ws, room, messages);
				break;

			case 'REVERSE':
				playReverseCard(dataObject, ws, room, messages);
				break;

			case 'COLOR':
				playColorCard(dataObject, ws, room, messages);
				break;
		}
	}



	// Si la carta no es especial pero hace algo, hacer la cosa
	else if(cardProperties.type === cards.cardTypes.doesSomething)
	{
		if(room.cardsToVictim > 0) //Si te están tirando tremendo +4
		{
			ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error: 'cantDefendWithThat'
			}));
			return;
		}

		switch(cardProperties.value)
		{
			default:
				ws.send(JSON.stringify(
				{
					operation: 'errorPlaying',
					error: 'not implemented yet'
				}));
				console.log('errorPlaying: not implemented yet: cartas no especiales que hacen cosas');
				return;

			case '0':
				playZeroCard(dataObject, ws, room, messages);
				break;
		}
	}



	// Si la carta jugada no es especial, hacer la cosa
	else playNormalCard(dataObject, ws, room, messages);
}



function playNormalCard(dataObject, ws, room, messages)
{
	if([dataObject, ws, room].includes(undefined))
	{
		console.log(colors.red('play.playNormalCard: alguno de los parámetros es undefined'));
		return;
	}

	const play = dataObject.play;
	const username = dataObject.username;
	const roomID = dataObject.roomID;

	if(messages === username) messages = [];

	if(room.cardsToVictim > 0) //Si te están tirando tremendo +4
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'cantDefendWithThat'
		}));
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

	game.utils.nextTurn(roomID); //Cambiar de turno dos veces para saltar el turno de la víctima
	game.utils.updatePlayers(roomID, messages);
}



function playBlockCard(dataObject, ws, room, messages)
{
	if([dataObject, ws, room, messages].includes(undefined))
	{
		console.log(colors.red('play.playBlockCard: alguno de los parámetros es undefined'));
		return;
	}

	//Si defenderse con bloqueo no está permitido en esta sala y hay cartas de las que defenderse, enviar un mensaje al jugador y no hacer nada.
	if(!room.rules.defendGimmick && room.cardsToVictim > 0)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'defendGimmickDisabled'
		}));
		console.log('errorPlaying: defendGimmickDisabled: en esta sala está desactivada la defensa con cartas especiales');
		return;
	}


	const play = dataObject.play;
	const username = dataObject.username;
	const roomID = dataObject.roomID;

	room.currentCard = play.card; //Actualizar la carta actual
	room.cardGrabbed = false; //Para que el jugador del turno siguiente pueda agarrar una carta del mazo
	room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck); //Quitar la carta jugada del mazo



	messages.push(msg.getMessage(msg.msgValues.cardPlayed,
	{
		username,
		cardname: msg.cardNames[play.card]
	}));



	if(room.cardsToVictim > 0) //Bloquear cartas +
	{
		messages.push(msg.getMessage(msg.msgValues.eatCardsCanceled,
		{
			username,
			cardsnumber: room.cardsToVictim
		}));

		room.cardsToVictim = 0;
		game.utils.nextTurn(roomID);
		game.utils.updatePlayers(roomID, messages);
	}
	else //Bloquear al siguiente jugador
	{
		messages.push(msg.getMessage(msg.msgValues.blocked,
		{
			victim: room.order[game.utils.whosNext(roomID)]
		}));
	
		game.utils.nextTurn(roomID);
		game.utils.nextTurn(roomID);
		game.utils.updatePlayers(roomID, messages);
	}
}



function playReverseCard(dataObject, ws, room, messages)
{
	if([dataObject, ws, room].includes(undefined))
	{
		console.log(colors.red('play.playReverseCard: alguno de los parámetros es undefined'));
		return;
	}

	//Si defenderse con bloqueo no está permitido en esta sala y hay cartas de las que defenderse, enviar un mensaje al jugador y no hacer nada.
	if(!room.rules.defendGimmick && room.cardsToVictim > 0)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'defendGimmickDisabled'
		}));
		console.log('errorPlaying: defendGimmickDisabled: en esta sala está desactivada la defensa con cartas especiales');
		return;
	}


	const play = dataObject.play;
	const username = dataObject.username;
	const roomID = dataObject.roomID;

	room.currentCard = play.card; //Actualizar la carta actual
	room.cardGrabbed = false; //Para que el jugador del turno siguiente pueda agarrar una carta del mazo
	room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck); //Quitar la carta jugada del mazo

	messages.push(msg.getMessage(msg.msgValues.cardPlayed,
	{
		username,
		cardname: msg.cardNames[play.card]
	}));


	if(room.cardsToVictim > 0) //Si hay cartas +, reflejarlas al del turno anterior
	{
		const victim = room.order[game.utils.whoWasBefore(roomID)];

		messages.push(msg.getMessage(msg.msgValues.eatCardsReflected,
		{
			username,
			victim,
			cardsnumber: room.cardsToVictim
		}));

		cards.giveCardsToVictim(roomID, victim);

		game.utils.nextTurn(roomID);
	}


	else if(room.order.length > 2) //Si son más de dos personas jugando cambiar el sentido de los turnos
	{
		game.utils.changeDirection(roomID);
		game.utils.nextTurn(roomID);

		messages.push(msg.getMessage(msg.msgValues.directionChanged));
	}


	else //Si solo son dos personas jugando, la persona que tiró la carta vuelve a tener el turno
	{
		const victim = room.order[game.utils.whosNext(roomID)];

		messages.push(msg.getMessage(msg.msgValues.blocked,
		{
			victim
		}));
	}

	game.utils.updatePlayers(roomID, messages);
}



function playColorCard(dataObject, ws, room, messages)
{
	if([dataObject, ws, room].includes(undefined))
	{
		console.log(colors.red('play.playColorCard: alguno de los parámetros es undefined'));
		return;
	}

	const play = dataObject.play;
	const username = dataObject.username;
	const roomID = dataObject.roomID;


	if(room.cardsToVictim > 0) //No creo que llegue a ocurrir, pero en caso de que sí, si te estan tirando cartas + y por algún motivo respondes con una carta de color, que funcione igual a que si respondes con una carta normal
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'cantDefendWithThat'
		}));
		return;
	}


	//room.currentCard = play.card; //Actualizar la carta actual
	room.cardGrabbed = false; //Para que el jugador del turno siguiente pueda agarrar una carta del mazo
	room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck); //Quitar la carta jugada del mazo


	const cardProperties = cards.properties[play.card];
	if(!cardProperties)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		console.log(`play.playColorCard: ${play.card} no es una carta válida`);
		return;
	}

	if(cardProperties.color === null && play.color !== undefined)
	{
		const colorProperties = cards.properties[play.color];
		if(!colorProperties)
		{
			ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error: 'invalidCard'
			}));
			console.log(`play.playColorCard: ${play.color} no es un color válido para COLOR`);
			return;
		}

		room.currentCard = play.color;
	}
	else if(cardProperties.color !== null && play.color === undefined)
	{
		room.currentCard = play.card;
	}
	else
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		console.log(`play.playColorCard: no se cumplieron ninguno de los requisitos para jugar una carta de color\ncardProperties.color = ${cardProperties.color} | play.color = ${play.color}`);
		return;
	}

	messages.push(msg.getMessage(msg.msgValues.colorChanged,
	{
		username,
		color: msg.colorNames[cards.properties[room.currentCard].color]
	}));

	game.utils.nextTurn(roomID);
	game.utils.updatePlayers(roomID, messages);
}



function playZeroCard(dataObject, ws, room, messages)
{
	if([dataObject, ws, room].includes(undefined))
	{
		console.log(colors.red('play.playZeroCard: alguno de los parámetros es undefined'));
		return;
	}

	const play = dataObject.play;
	const username = dataObject.username;
	const roomID = dataObject.roomID;

	const victim = play.change;

	if(victim === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidVictim'
		}));
		console.log('errorPlaying: invalidVictim: victim is undefined');
		return;
	}
	if(victim !== null)
	{
		if(!room.rules.zeroInterchange)
		{
			ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error:'zeroInterchangeDisabled'
			}));
			console.log('errorPlaying: zeroInterchangeDisabled: en esta sala no se puede intercambiar mazos');
			return;
		}
		if(!room.order.includes(victim))
		{
			ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error: 'invalidVictim'
			}));
			console.log('errorPlaying: invalidVictim: victim is not in the room');
			return;
		}
	}

	room.currentCard = play.card; //Actualizar la carta actual
	room.cardGrabbed = false; //Para que el jugador del turno siguiente pueda agarrar una carta del mazo
	room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck); //Quitar la carta jugada del mazo

	if(victim !== null)
	{
		//Cambiar los mazos del jugador y la victima
		let aux = room.players[username].deck;
		room.players[username].deck = room.players[victim].deck;
		room.players[victim].deck = aux;
	
		messages.push(msg.getMessage(msg.msgValues.interchangeDecks,
		{
			username,
			victim
		}));
	}
	else messages.push(msg.getMessage(msg.msgValues.cardPlayed,
	{
		username,
		cardname: msg.cardNames[play.card]
	}));

	game.utils.nextTurn(roomID);
	game.utils.updatePlayers(roomID, messages);
}



function playPlusOneCard(dataObject, ws, room, messages)
{
	if([dataObject, ws, room].includes(undefined))
	{
		console.log(colors.red('play.playPlusOneCard: alguno de los parámetros es undefined'));
		return;
	}

	const play = dataObject.play;
	const username = dataObject.username;
	const roomID = dataObject.roomID;

	if(messages === undefined) messages = [];

	if(room.cardsToVictim > 0) //No creo que llegue a ocurrir, pero en caso de que sí, si te estan tirando cartas + y por algún motivo respondes con una carta de color, que funcione igual a que si respondes con una carta normal
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'cantDefendWithThat'
		}));
		return;
	}


	room.currentCard = play.card; //Actualizar la carta actual
	room.cardGrabbed = false; //Para que el jugador del turno siguiente pueda agarrar una carta del mazo
	room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck); //Quitar la carta jugada del mazo

	for(let i = 0; i < room.order.length; i++)
	{
		if(room.order[i] === username) continue;
		cards.giveCardsToSomeone(roomID, room.order[i], 1);
	}

	messages.push(msg.getMessage(msg.msgValues.cardPlayed,
	{
		username,
		cardname: msg.cardNames[play.card]
	}));
	messages.push(msg.getMessage(msg.msgValues.cardsForEveryone));
	
	game.utils.nextTurn(roomID); //Pasar el turno al siguiente jugador
	game.utils.updatePlayers(roomID, messages); //Enviar el estado de la partida a todos los jugadores
}

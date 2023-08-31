
const game = require('../utils/game');
const cards = require('../utils/cards');

const rand = require('generate-key');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'createGame',
		username: nombre del usuario master,
		rules: (opcional)
		{
			cardsAtStart, (opcional)
			moreSpecialCards, (opcional)
			defendGimmick, (opcional)
			zeroInterchange (opcional)
		}
	}

	Respuesta:
	{
		operation: 'obtainRoomID'
		roomID,
		players:
		[
			array con todos los jugadores esperando, debería de estar solo el nombre del jugador master al momento de enviar esto
		]
	}
	*/

	console.log('---------------\ncreateGame\n');

	let username = dataObject.username;

	if(username === undefined
	|| typeof username !== 'string'
	|| username.trim() === ''
	|| username.length > 20)
	{
		console.log('Los requisitos no se cumplen');
		ws.send(JSON.stringify(
		{
			error: 'badRequest',
			operation: 'obtainRoomID'
		}));
		return;
	}



	//Aplicar las reglas
	let rules = dataObject.rules;
	let defaultRules =
	{
		cardsAtStart: 7,
		moreSpecialCards: true,
		defendGimmick: true,
		zeroInterchange: true
	}

	if(rules === undefined) rules = defaultRules; //Aplicar las reglas por defecto si no se envía ninguna
	else
	{
		//Comprobar si las reglas son válidas
		let rulesKeys = Object.keys(rules);
		rulesKeys.forEach((i) => 
		{
			//Si alguna regla no está en esta lista, no es una regla válida
			if(!['cardsAtStart', 'moreSpecialCards', 'defendGimmick', 'zeroInterchange'].includes(i))
			{
				ws.send(JSON.stringify(
				{
					operation: 'obtainRoomID',
					error: 'invalidRules'
				}));
				console.log(`obtainRoomID: invalidRules: la regla ${i} no es válida`);
				return;
			}
		});

		//Comprobar que cardsAtStart sea un número válido
		if(rules.cardsAtStart !== undefined)
		{
			if(typeof rules.cardsAtStart !== 'number'
			|| isNaN(rules.cardsAtStart)
			|| rules.cardsAtStart < 2)
			{
				ws.send(JSON.stringify(
				{
					operation: 'obtainRoomID',
					error: 'invalidRules'
				}));
				console.log('obtainRoomID: invalidRules: cardsAtStart no es válido', rules.cardsAtStart);
				return;
			}
		}
		else rules.cardsAtStart = defaultRules.cardsAtStart;

		//Comprobar que moreSpecialCards tenga un valor válido
		if(rules.moreSpecialCards !== undefined)
		{
			if(typeof rules.moreSpecialCards !== 'boolean')
			{
				ws.send(JSON.stringify(
				{
					operation: 'obtainRoomID',
					error: 'invalidRules'
				}));
				console.log('obtainRoomID: invalidRules: moreSpecialCards no es un boolean');
				return;
			}
		}
		else rules.moreSpecialCards = defaultRules.moreSpecialCards;

		//Comprobar que defendGimmick tenga un valor válido
		if(rules.defendGimmick !== undefined)
		{
			if(typeof rules.defendGimmick !== 'boolean')
			{
				ws.send(JSON.stringify(
				{
					operation: 'obtainRoomID',
					error: 'invalidRules'
				}));
				console.log('obtainRoomID: invalidRules: defendGimmick no es un boolean');
				return;
			}
		}
		else rules.defendGimmick = defaultRules.defendGimmick;

		//Comprobar que zeroInterchange tenga un valor válido
		if(rules.zeroInterchange !== undefined)
		{
			if(typeof rules.zeroInterchange !== 'boolean')
			{
				ws.send(JSON.stringify(
				{
					operation: 'obtainRoomID',
					error: 'invalidRules'
				}));
				console.log('obtainRoomID: invalidRules: zeroInterchange no es un boolean');
				return;
			}
		}
		else rules.zeroInterchange = defaultRules.zeroInterchange;
	}



	//Generar una roomID única
	let roomID = rand.generateKey(4).toLowerCase();
	while(game.activeGames[roomID] !== undefined)
	{
		roomID = rand.generateKey(4).toLowerCase();
	}



	// Crear una partida
	const table = cards.newTable();
	const key = rand.generateKey(7);

	game.activeGames[roomID] =
	{
		master: username,
		currentCard: cards.getNormalCard(),
		letMorePlayersIn: true,
		whoIsPlaying: 0,
		direction: 1,
		cardGrabbed: false,
		cardsToVictim: 0,
		rules,
		order: [],
		table,
		keys:
		{
			[key]: username
		},
		players:
		{
			[username]:
			{
				deck: [],
				ws
			}
		},
		timeout: undefined
	}

	//Crear el deck del jugador, se crea a parte porque es necesario que el juego esté creado para poder obtener cartas
	game.activeGames[roomID].players[username].deck = cards.generateDeck(roomID, username);
	
	console.log('Estado de los juegos', game.activeGames);
	//console.log('Estado del usuario', game.activeGames[roomID].players[username]);



	ws.gameInfo.push(
	{
		username,
		roomID
	});



	ws.send(JSON.stringify(
	{
		operation: 'obtainRoomID',
		roomID,
		key,
		players:
		[
			username
		]
	}));
}
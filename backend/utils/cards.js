const allCards =
[
	'1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0r',
	'1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '0g',
	'1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0b',
	'1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0y',
	'+2r', '+2g', '+2b', '+2y',
	'BLOCKr', 'BLOCKg', 'BLOCKb', 'BLOCKy',
	'REVERSEr', 'REVERSEg', 'REVERSEb', 'REVERSEy',
	'+4', 'COLOR'
];

const normalCards =
[
	'1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0r',
	'1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '0g',
	'1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0b',
	'1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0y'
];

const specialCards =
[
	'+2r', '+2g', '+2b', '+2y',
	'BLOCKr', 'BLOCKg', 'BLOCKb', 'BLOCKy',
	'REVERSEr', 'REVERSEg', 'REVERSEb', 'REVERSEy',
	'+4',
	'COLOR', 'COLORr', 'COLORg', 'COLORb', 'COLORy'
];

const moreSpecialCards =
[
	'+1r', '+1g', '+1b', '+1y',
	'+6r', '+6g', '+6b', '+6y',
	'BLANKr', 'BLANKg', 'BLANKb', 'BLANKy',
	'INTERCHANGEr', 'INTERCHANGEg', 'INTERCHANGEb', 'INTERCHANGEy'
];

const cardTypes =
{
	special: 'special',
	moreSpecial: 'moreSpecial',
	normal: 'normal',
	doesSomething: 'doesSomething'
}

const properties =
{
	'+1r': { type: cardTypes.moreSpecial, color: 'r', value: '+1' },
	'+1g': { type: cardTypes.moreSpecial, color: 'g', value: '+1' },
	'+1b': { type: cardTypes.moreSpecial, color: 'b', value: '+1' },
	'+1y': { type: cardTypes.moreSpecial, color: 'y', value: '+1' },
	'+6r': { type: cardTypes.moreSpecial, color: 'r', value: '+6' },
	'+6g': { type: cardTypes.moreSpecial, color: 'g', value: '+6' },
	'+6b': { type: cardTypes.moreSpecial, color: 'b', value: '+6' },
	'+6y': { type: cardTypes.moreSpecial, color: 'y', value: '+6' },
	'BLANKr': { type: cardTypes.moreSpecial, color: 'r', value: 'BLANK' },
	'BLANKg': { type: cardTypes.moreSpecial, color: 'g', value: 'BLANK' },
	'BLANKb': { type: cardTypes.moreSpecial, color: 'b', value: 'BLANK' },
	'BLANKy': { type: cardTypes.moreSpecial, color: 'y', value: 'BLANK' },
	'INTERCHANGEr': { type: cardTypes.moreSpecial, color: 'r', value: 'INTERCHANGE' },
	'INTERCHANGEg': { type: cardTypes.moreSpecial, color: 'g', value: 'INTERCHANGE' },
	'INTERCHANGEb': { type: cardTypes.moreSpecial, color: 'b', value: 'INTERCHANGE' },
	'INTERCHANGEy': { type: cardTypes.moreSpecial, color: 'y', value: 'INTERCHANGE' },
	'+2r': { type: cardTypes.special, color: 'r', value: '+2' },
	'+2g': { type: cardTypes.special, color: 'g', value: '+2' },
	'+2b': { type: cardTypes.special, color: 'b', value: '+2' },
	'+2y': { type: cardTypes.special, color: 'y', value: '+2' },
	'BLOCKr': { type: cardTypes.special, color: 'r', value: 'BLOCK' },
	'BLOCKg': { type: cardTypes.special, color: 'g', value: 'BLOCK' },
	'BLOCKb': { type: cardTypes.special, color: 'b', value: 'BLOCK' },
	'BLOCKy': { type: cardTypes.special, color: 'y', value: 'BLOCK' },
	'REVERSEr': { type: cardTypes.special, color: 'r', value: 'REVERSE' },
	'REVERSEg': { type: cardTypes.special, color: 'g', value: 'REVERSE' },
	'REVERSEb': { type: cardTypes.special, color: 'b', value: 'REVERSE'},
	'REVERSEy': { type: cardTypes.special, color: 'y', value: 'REVERSE' },
	'+4': { type: cardTypes.special, color: null, value: '+4' },
	'COLOR': { type: cardTypes.special, color: null, value: 'COLOR' },
	'COLORr': { type: cardTypes.special, color: 'r', value: 'COLOR' },
	'COLORg': { type: cardTypes.special, color: 'g', value: 'COLOR' },
	'COLORb': { type: cardTypes.special, color: 'b', value: 'COLOR' },
	'COLORy': { type: cardTypes.special, color: 'y', value: 'COLOR' },
	'1r': { type: cardTypes.normal, color: 'r', value: '1' },
	'2r': { type: cardTypes.normal, color: 'r', value: '2' },
	'3r': { type: cardTypes.normal, color: 'r', value: '3' },
	'4r': { type: cardTypes.normal, color: 'r', value: '4' },
	'5r': { type: cardTypes.normal, color: 'r', value: '5' },
	'6r': { type: cardTypes.normal, color: 'r', value: '6' },
	'7r': { type: cardTypes.normal, color: 'r', value: '7' },
	'8r': { type: cardTypes.normal, color: 'r', value: '8' },
	'9r': { type: cardTypes.normal, color: 'r', value: '9' },
	'0r': { type: cardTypes.doesSomething, color: 'r', value: '0' },
	'1g': { type: cardTypes.normal, color: 'g', value: '1' },
	'2g': { type: cardTypes.normal, color: 'g', value: '2' },
	'3g': { type: cardTypes.normal, color: 'g', value: '3' },
	'4g': { type: cardTypes.normal, color: 'g', value: '4' },
	'5g': { type: cardTypes.normal, color: 'g', value: '5' },
	'6g': { type: cardTypes.normal, color: 'g', value: '6' },
	'7g': { type: cardTypes.normal, color: 'g', value: '7' },
	'8g': { type: cardTypes.normal, color: 'g', value: '8' },
	'9g': { type: cardTypes.normal, color: 'g', value: '9' },
	'0g': { type: cardTypes.doesSomething, color: 'g', value: '0' },
	'1b': { type: cardTypes.normal, color: 'b', value: '1' },
	'2b': { type: cardTypes.normal, color: 'b', value: '2' },
	'3b': { type: cardTypes.normal, color: 'b', value: '3' },
	'4b': { type: cardTypes.normal, color: 'b', value: '4' },
	'5b': { type: cardTypes.normal, color: 'b', value: '5' },
	'6b': { type: cardTypes.normal, color: 'b', value: '6' },
	'7b': { type: cardTypes.normal, color: 'b', value: '7' },
	'8b': { type: cardTypes.normal, color: 'b', value: '8' },
	'9b': { type: cardTypes.normal, color: 'b', value: '9' },
	'0b': { type: cardTypes.doesSomething, color: 'b', value: '0' },
	'1y': { type: cardTypes.normal, color: 'y', value: '1' },
	'2y': { type: cardTypes.normal, color: 'y', value: '2' },
	'3y': { type: cardTypes.normal, color: 'y', value: '3' },
	'4y': { type: cardTypes.normal, color: 'y', value: '4' },
	'5y': { type: cardTypes.normal, color: 'y', value: '5' },
	'6y': { type: cardTypes.normal, color: 'y', value: '6' },
	'7y': { type: cardTypes.normal, color: 'y', value: '7' },
	'8y': { type: cardTypes.normal, color: 'y', value: '8' },
	'9y': { type: cardTypes.normal, color: 'y', value: '9' },
	'0y': { type: cardTypes.doesSomething, color: 'y', value: '0' }
}



const game = require('./game');
const random = require('./random');

const colors = require('colors');

function newTable()
{
	const table =
	[
		'1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '+2r', 'REVERSEr', 'BLOCKr', '0r', '+4',
		'1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '+2r', 'REVERSEr', 'BLOCKr', 'COLOR',
		
		'1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '+2g', 'REVERSEg', 'BLOCKg', '0g', '+4',
		'1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '+2g', 'REVERSEg', 'BLOCKg', 'COLOR',

		'1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '+2b', 'REVERSEb', 'BLOCKb', '0b', '+4',
		'1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '+2b', 'REVERSEb', 'BLOCKb', 'COLOR',
		
		'1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '+2y', 'REVERSEy', 'BLOCKy', '0y', '+4',
		'1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '+2y', 'REVERSEy', 'BLOCKy', 'COLOR',

		'+1r', '+1g', '+1b', '+1y',
		'+6r', '+6g', '+6b', '+6y',
		'BLANKr', 'BLANKg', 'BLANKb', 'BLANKy',
		'INTERCHANGEr', 'INTERCHANGEg', 'INTERCHANGEb', 'INTERCHANGEy',
		'COLORr', 'COLORg', 'COLORb', 'COLORy'
	];
	return table;
}

function getCard(roomID)
{
	if(roomID === undefined)
	{
		console.log(colors.red('cards.getCard: roomID es undefined'));
		return allCards[0];
	}

	const room = game.activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`cards.getCard: ${roomID} is not a valid room`));
		return allCards[0];
	}

	const table = room.table;
	if(table === undefined || !Array.isArray(table))
	{
		console.log(colors.red(`cards.getCard: ${roomID} doesn't have a valid table`));
		return allCards[0];
	}

	//Hacer que se elijan cartas random de la mesa
	const n = random.range(0, table.length - 1);
	const card = table[n];
	if(card === undefined)
	{
		console.log(colors.red(`cards.getCard: table[${n}] no contiene una carta válida`));
		return table[0];
	}

	let tableUpdate = deleteFromDeck(card, table);
	if(tableUpdate.length < 3)
	{
		tableUpdate = newTable();
		console.log('Mesa recargada');
	}
	
	room.table = tableUpdate;

	return card;
}

function getNormalCard()
{
	let cardIndex = random.range(0, normalCards.length - 1);
	let card = normalCards[cardIndex];
	if(card !== undefined) return card;
	else
	{
		console.log(colors.red(`cards.getCard: normalCards[${cardIndex}] is undefined`));
		return normalCards[0];
	}
}

/*
function getCard(type)
{
	if(type === 'all')
	{
		let cardIndex = random.range(0, allCards.length);
		let card = allCards[cardIndex];
		if(card !== undefined) return card;
		else
		{
			console.log(colors.red(`cards.getCard: allCards[${cardIndex}] is undefined`));
			return allCards[0];
		}
	}
	else if(type === 'normal')
	{
		let cardIndex = random.range(0, normalCards.length);
		let card = normalCards[cardIndex];
		if(card !== undefined) return card;
		else
		{
			console.log(colors.red(`cards.getCard: normalCards[${cardIndex}] is undefined`));
			return normalCards[0];
		}
	}
	else if(type === 'special')
	{
		let cardIndex = random.range(0, specialCards.length);
		let card = specialCards[cardIndex];
		if(card !== undefined) return card;
		else
		{
			console.log(colors.red(`cards:getCard: specialCards[${cardIndex}] is undefined`));
			return specialCards[0];
		}
	}
	else
	{
		console.log(colors.red(`cards.getCard: ${type} no es un tipo de carta`));
		return undefined;
	}
}
*/

function generateDeck(roomID)
{
	let deck = [];
	for(let i = 0; i < 7; i++)
	{
		deck.push(getCard(roomID));
	}
	console.log('cards.generateDeck: deck generado', deck);
	return deck;
}

function deleteFromDeck(card, deck)
{
	if(!Array.isArray(deck) || typeof card !== 'string')
	{
		console.log(colors.red('cards.deleteFromDeck: invalid arguments'));
		return;
	}

	// Convertir la carta en null
	let deleted = false;
	for(let i = 0; i < deck.length; i++)
	{
		if(deck[i] === card)
		{
			deck[i] = null;
			deleted = true;
			break;
		}
	}

	if(!deleted)
	{
		console.log(colors.yellow(`cards.deleteFromDeck: no card ${card} found in ${deck}`));
		return deck;
	}

	// Reconstruir todo el mazo sin nulls
	let newDeck = [];
	for(let i = 0; i < deck.length; i++)
	{
		if(deck[i] !== null) newDeck.push(deck[i]);
	}

	return newDeck;
}

function cardIsValid(card, currentCard)
{
	const cardProps = properties[card];
	const currentCardProps = properties[currentCard];

	let sameColor = false;
	let sameValue = false;

	sameColor = currentCardProps.color === cardProps.color;
	sameValue = currentCardProps.value === cardProps.value;

	if(currentCardProps.color === null || cardProps.color === null) sameColor = true;

	return sameColor || sameValue;
}

function deckContainsSpecificsCards(cards, deck)
{
	if([cards, deck].includes(undefined) || !Array.isArray(cards), !Array.isArray(deck))
	{
		console.log(colors.yellow('cards.deckContainsSpecificsCards: properties are undefined or not an array'));
		return false;
	}

	for(let i = 0; i < deck.length; i++)
	{
		for(let j = 0; j < cards.length; j++)
		{
			if(cards[j] === deck[i]) return true;
		}
	}
	return false;
}


function giveCardsToVictim(roomID, victim)
{
	const newCards = [];
	const cardsToVictim = game.activeGames[roomID].cardsToVictim;
	for(let i = 0; i < cardsToVictim; i++)
	{
		newCards.push(getCard(roomID));
	}
	console.log('Cartas para la víctima', newCards);

	game.activeGames[roomID].players[victim].deck.push(...newCards); //Añadir las cartas al mazo de la víctima
	console.log('Mazo de la víctima', game.activeGames[roomID].players[victim].deck);
	game.activeGames[roomID].cardsToVictim = 0; //Reiniciar el número de cartas para la siguiente víctima
}

module.exports =
{
	getCard,
	getNormalCard,
	newTable,
	generateDeck,
	deleteFromDeck,
	cardIsValid,
	deckContainsSpecificsCards,
	giveCardsToVictim,
	cardsArrays:
	{
		allCards,
		normalCards,
		specialCards
	},
	properties,
	cardTypes
}
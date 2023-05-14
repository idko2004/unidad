const allCards =
[
	'1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0r',
	'1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '0g',
	'1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0b',
	'1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0y',
	'+2r', '+2g', '+2b', '+2y',
	'SKIPr', 'SKIPg', 'SKIPb', 'SKIPy',
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
	'SKIPr', 'SKIPg', 'SKIPb', 'SKIPy',
	'REVERSEr', 'REVERSEg', 'REVERSEb', 'REVERSEy',
	'+4', 'COLOR'
];

const cardTypes =
{
	'+2r': { special: true },
	'+2g': { special: true },
	'+2b': { special: true },
	'+2y': { special: true },
	'SKIPr': { special: true },
	'SKIPg': { special: true },
	'SKIPb': { special: true },
	'SKIPy': { special: true },
	'REVERSEr': { special: true },
	'REVERSEg': { special: true },
	'REVERSEb': { special: true },
	'REVERSEy': { special: true },
	'+4': { special: true },
	'COLOR': { special: true },
	'1r': { special: false, doesSomething: false },
	'2r': { special: false, doesSomething: false },
	'3r': { special: false, doesSomething: false },
	'4r': { special: false, doesSomething: false },
	'5r': { special: false, doesSomething: false },
	'6r': { special: false, doesSomething: false },
	'7r': { special: false, doesSomething: false },
	'8r': { special: false, doesSomething: false },
	'9r': { special: false, doesSomething: false },
	'0r': { special: false, doesSomething: true },
	'1g': { special: false, doesSomething: false },
	'2g': { special: false, doesSomething: false },
	'3g': { special: false, doesSomething: false },
	'4g': { special: false, doesSomething: false },
	'5g': { special: false, doesSomething: false },
	'6g': { special: false, doesSomething: false },
	'7g': { special: false, doesSomething: false },
	'8g': { special: false, doesSomething: false },
	'9g': { special: false, doesSomething: false },
	'0g': { special: false, doesSomething: true },
	'1b': { special: false, doesSomething: false },
	'2b': { special: false, doesSomething: false },
	'3b': { special: false, doesSomething: false },
	'4b': { special: false, doesSomething: false },
	'5b': { special: false, doesSomething: false },
	'6b': { special: false, doesSomething: false },
	'7b': { special: false, doesSomething: false },
	'8b': { special: false, doesSomething: false },
	'9b': { special: false, doesSomething: false },
	'0b': { special: false, doesSomething: true },
	'1y': { special: false, doesSomething: false },
	'2y': { special: false, doesSomething: false },
	'3y': { special: false, doesSomething: false },
	'4y': { special: false, doesSomething: false },
	'5y': { special: false, doesSomething: false },
	'6y': { special: false, doesSomething: false },
	'7y': { special: false, doesSomething: false },
	'8y': { special: false, doesSomething: false },
	'9y': { special: false, doesSomething: false },
	'0y': { special: false, doesSomething: true }
}



const random = require('./random');

const colors = require('colors');

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

function generateDeck()
{
	let deck = [];
	for(let i = 0; i < 7; i++)
	{
		deck.push(getCard('all'));
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

module.exports =
{
	getCard,
	generateDeck,
	deleteFromDeck,
	cardsArrays:
	{
		allCards,
		normalCards,
		specialCards
	},
	cardTypes
}
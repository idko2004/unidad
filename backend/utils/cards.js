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
	'+4', 'COLOR'
];

const properties =
{
	'+2r': { special: true, color: 'r', value: '+2' },
	'+2g': { special: true, color: 'g', value: '+2' },
	'+2b': { special: true, color: 'b', value: '+2' },
	'+2y': { special: true, color: 'y', value: '+2' },
	'BLOCKr': { special: true, color: 'r', value: 'BLOCK' },
	'BLOCKg': { special: true, color: 'g', value: 'BLOCK' },
	'BLOCKb': { special: true, color: 'b', value: 'BLOCK' },
	'BLOCKy': { special: true, color: 'y', value: 'BLOCK' },
	'REVERSEr': { special: true, color: 'r', value: 'REVERSE' },
	'REVERSEg': { special: true, color: 'g', value: 'REVERSE' },
	'REVERSEb': { special: true , color: 'b', value: 'REVERSE'},
	'REVERSEy': { special: true, color: 'y', value: 'REVERSE' },
	'+4': { special: true, color: null, value: '+4' },
	'COLOR': { special: true, color: null, value: 'COLOR' },
	'1r': { special: false, doesSomething: false, color: 'r', value: '1' },
	'2r': { special: false, doesSomething: false, color: 'r', value: '2' },
	'3r': { special: false, doesSomething: false, color: 'r', value: '3' },
	'4r': { special: false, doesSomething: false, color: 'r', value: '4' },
	'5r': { special: false, doesSomething: false, color: 'r', value: '5' },
	'6r': { special: false, doesSomething: false, color: 'r', value: '6' },
	'7r': { special: false, doesSomething: false, color: 'r', value: '7' },
	'8r': { special: false, doesSomething: false, color: 'r', value: '8' },
	'9r': { special: false, doesSomething: false, color: 'r', value: '9' },
	'0r': { special: false, doesSomething: true , color: 'r', value: '0' },
	'1g': { special: false, doesSomething: false, color: 'g', value: '1' },
	'2g': { special: false, doesSomething: false, color: 'g', value: '2' },
	'3g': { special: false, doesSomething: false, color: 'g', value: '3' },
	'4g': { special: false, doesSomething: false, color: 'g', value: '4' },
	'5g': { special: false, doesSomething: false, color: 'g', value: '5' },
	'6g': { special: false, doesSomething: false, color: 'g', value: '6' },
	'7g': { special: false, doesSomething: false, color: 'g', value: '7' },
	'8g': { special: false, doesSomething: false, color: 'g', value: '8' },
	'9g': { special: false, doesSomething: false, color: 'g', value: '9' },
	'0g': { special: false, doesSomething: true, color: 'g', value: '0' },
	'1b': { special: false, doesSomething: false, color: 'b', value: '1' },
	'2b': { special: false, doesSomething: false, color: 'b', value: '2' },
	'3b': { special: false, doesSomething: false, color: 'b', value: '3' },
	'4b': { special: false, doesSomething: false, color: 'b', value: '4' },
	'5b': { special: false, doesSomething: false, color: 'b', value: '5' },
	'6b': { special: false, doesSomething: false, color: 'b', value: '6' },
	'7b': { special: false, doesSomething: false, color: 'b', value: '7' },
	'8b': { special: false, doesSomething: false, color: 'b', value: '8' },
	'9b': { special: false, doesSomething: false, color: 'b', value: '9' },
	'0b': { special: false, doesSomething: true, color: 'b', value: '0' },
	'1y': { special: false, doesSomething: false, color: 'y', value: '1' },
	'2y': { special: false, doesSomething: false, color: 'y', value: '2' },
	'3y': { special: false, doesSomething: false, color: 'y', value: '3' },
	'4y': { special: false, doesSomething: false, color: 'y', value: '4' },
	'5y': { special: false, doesSomething: false, color: 'y', value: '5' },
	'6y': { special: false, doesSomething: false, color: 'y', value: '6' },
	'7y': { special: false, doesSomething: false, color: 'y', value: '7' },
	'8y': { special: false, doesSomething: false, color: 'y', value: '8' },
	'9y': { special: false, doesSomething: false, color: 'y', value: '9' },
	'0y': { special: false, doesSomething: true, color: 'y', value: '0' }
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

module.exports =
{
	getCard,
	generateDeck,
	deleteFromDeck,
	cardIsValid,
	deckContainsSpecificsCards,
	cardsArrays:
	{
		allCards,
		normalCards,
		specialCards
	},
	properties
}
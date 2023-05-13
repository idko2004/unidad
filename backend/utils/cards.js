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

module.exports =
{
    getCard,
    generateDeck,
    cardsArrays:
    {
        allCards,
        normalCards,
        specialCards
    }
}
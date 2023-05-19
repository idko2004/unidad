const cardsProperties =
{
	'+2r': { color: 'r', value: '+2' },
	'+2g': { color: 'g', value: '+2' },
	'+2b': { color: 'b', value: '+2' },
	'+2y': { color: 'y', value: '+2' },
	'BLOCKr': { color: 'r', value: 'BLOCK' },
	'BLOCKg': { color: 'g', value: 'BLOCK' },
	'BLOCKb': { color: 'b', value: 'BLOCK' },
	'BLOCKy': { color: 'y', value: 'BLOCK' },
	'REVERSEr': { color: 'r', value: 'REVERSE' },
	'REVERSEg': { color: 'g', value: 'REVERSE' },
	'REVERSEb': { color: 'b', value: 'REVERSE'},
	'REVERSEy': { color: 'y', value: 'REVERSE' },
	'+4': { color: null, value: '+4' },
	'COLOR': { color: null, value: 'COLOR' },
	'1r': { color: 'r', value: '1' },
	'2r': { color: 'r', value: '2' },
	'3r': { color: 'r', value: '3' },
	'4r': { color: 'r', value: '4' },
	'5r': { color: 'r', value: '5' },
	'6r': { color: 'r', value: '6' },
	'7r': { color: 'r', value: '7' },
	'8r': { color: 'r', value: '8' },
	'9r': { color: 'r', value: '9' },
	'0r': { color: 'r', value: '0' },
	'1g': { color: 'g', value: '1' },
	'2g': { color: 'g', value: '2' },
	'3g': { color: 'g', value: '3' },
	'4g': { color: 'g', value: '4' },
	'5g': { color: 'g', value: '5' },
	'6g': { color: 'g', value: '6' },
	'7g': { color: 'g', value: '7' },
	'8g': { color: 'g', value: '8' },
	'9g': { color: 'g', value: '9' },
	'0g': { color: 'g', value: '0' },
	'1b': { color: 'b', value: '1' },
	'2b': { color: 'b', value: '2' },
	'3b': { color: 'b', value: '3' },
	'4b': { color: 'b', value: '4' },
	'5b': { color: 'b', value: '5' },
	'6b': { color: 'b', value: '6' },
	'7b': { color: 'b', value: '7' },
	'8b': { color: 'b', value: '8' },
	'9b': { color: 'b', value: '9' },
	'0b': { color: 'b', value: '0' },
	'1y': { color: 'y', value: '1' },
	'2y': { color: 'y', value: '2' },
	'3y': { color: 'y', value: '3' },
	'4y': { color: 'y', value: '4' },
	'5y': { color: 'y', value: '5' },
	'6y': { color: 'y', value: '6' },
	'7y': { color: 'y', value: '7' },
	'8y': { color: 'y', value: '8' },
	'9y': { color: 'y', value: '9' },
	'0y': { color: 'y', value: '0' }
}

function validCard(card, currentCard)
{
	const cardProps = cardsProperties[card];
	const currentCardProps = cardsProperties[currentCard];

	let sameColor = false;
	let sameValue = false;

	sameColor = currentCardProps.color === cardProps.color;
	sameValue = currentCardProps.value === cardProps.value;

	if(currentCardProps.color === null) sameColor = true;

	return sameColor || sameValue;
}

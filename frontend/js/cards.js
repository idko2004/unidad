let cardsProperties;

function askForCardProperties()
{
	ws.send(JSON.stringify(
	{
		operation: 'getCardProperties'
	}));
}

function receiveCardProperties(response)
{
	cardsProperties = response.properties;
}

function validCard(card, currentCard)
{
	const cardProps = cardsProperties[card];
	const currentCardProps = cardsProperties[currentCard];

	if([cardProps, currentCardProps].includes(undefined))
	{
		console.log(colors.red(`cards.cardIsValid: cardProps(${cardProps === undefined}) currentCardProps(${currentCardProps === undefined}), uno de estos es undefined`));
		return false;
	}

	let sameColor = false;
	let sameValue = false;

	sameColor = currentCardProps.color === cardProps.color;
	sameValue = currentCardProps.value === cardProps.value;

	//Si alguna de las cartas no tiene color (o color blanco)
	if(currentCardProps.color === null || cardProps.color === null) sameColor = true;

	/*
	//Casos especiales

	//Si la carta actual es un +2 o +6 y la carta elegida es para bloquear
	if(['+2', '+6'].includes(currentCardProps.value) && cardProps.value === 'BLOCK') return true;
	*/

	//Si la carta que estamos tirando es un cambiacolor, da igual que carta sea la actual
	if(cardProps.value === 'COLOR') return true;

	return sameColor || sameValue;
}

const colors = require('colors');

const msgValues =
{
	yourTurn: 'yourTurn',
	turn: 'turn',
	cardPlayed: 'cardPlayed',
	skipTurn: 'skipTurn',
	accumuledCards: 'accumuledCards',
	cardsEaten: 'cardsEaten',
	eatCardsCanceled: 'eatCardsCanceled',
	eatCardsReflected: 'eatCardsReflected',
	blocked: 'blocked',
	directionChanged: 'directionChanged',
	colorChanged: 'colorChanged',
	interchangeDecks: 'interchangeDecks',
	oneCard: 'oneCard'
}

const messages =
{
	yourTurn: 'Tu turno',
	turn: 'Es el turno de %username%',
	cardPlayed: '%username% tiró un %cardname%',
	skipTurn: '%username% no tira nada',
	accumuledCards: '%username% tiró un %cardname%. ¡Hay %cardsnumber% acumuladas!',
	cardsEaten: '¡%victim% se comió %cardsnumber% cartas!',
	eatCardsCanceled: '%username% evitó comerse %cardsnumber% cartas',
	eatCardsReflected: '%username% le devolvió %cardsnumber% cartas a %victim%',
	blocked: '%victim% no puede jugar',
	directionChanged: 'Los turnos ahora van en la dirección contraria',
	colorChanged: '%username% cambió el color a %color%',
	interchangeDecks: '%username% intercambió mazos con %victim%',
	oneCard: '¡A %username% SOLO LE QUEDA UNA CARTA!'
}

const cardNames =
{
	'1r': "1 rojo",
	'2r': "2 rojo",
	'3r': "3 rojo",
	'4r': "4 rojo",
	'5r': "5 rojo",
	'6r': "6 rojo",
	'7r': "7 rojo",
	'8r': "8 rojo",
	'9r': "9 rojo",
	'0r': "0 rojo",
	'1g': "1 verde",
	'2g': "2 verde",
	'3g': "3 verde",
	'4g': "4 verde",
	'5g': "5 verde",
	'6g': "6 verde",
	'7g': "7 verde",
	'8g': "8 verde",
	'9g': "9 verde",
	'0g': "0 verde",
	'1b': "1 azul",
	'2b': "2 azul",
	'3b': "3 azul",
	'4b': "4 azul",
	'5b': "5 azul",
	'6b': "6 azul",
	'7b': "7 azul",
	'8b': "8 azul",
	'9b': "9 azul",
	'0b': "0 azul",
	'1y': "1 amarillo",
	'2y': "2 amarillo",
	'3y': "3 amarillo",
	'4y': "4 amarillo",
	'5y': "5 amarillo",
	'6y': "6 amarillo",
	'7y': "7 amarillo",
	'8y': "8 amarillo",
	'9y': "9 amarillo",
	'0y': "0 amarillo",
	'+2r': "+2 rojo",
	'+2g': "+2 verde",
	'+2b': "+2 azul",
	'+2y': "+2 amarillo",
	'+4': "+4",
	'+6r': "+6 rojo",
	'+6g': '+6 verde',
	'+6b': "+6 azul",
	'+6y': "+6 amarillo",
	'BLOCKr': "Bloqueo rojo",
	'BLOCKg': "Bloqueo verde",
	'BLOCKb': "Bloqueo azul",
	'BLOCKy': "Bloqueo amarillo",
	'REVERSEr': "Reversa rojo",
	'REVERSEg': "Reversa verde",
	'REVERSEb': "Reversa azul",
	'REVERSEy': "Reversa amarillo",
	'COLOR': "Cambiacolor",
	'COLORr': "Cambiacolor rojo",
	'COLORg': "Cambiacolor verde",
	'COLORb': "Cambiacolor azul",
	'COLORy': "Cambiacolor amarillo",
	'+1r': "+1 rojo para todos",
	'+1g': "+1 verde para todos",
	'+1b': "+1 azul para todos",
	'+1y': "+1 amarillo para todos",
	'BLANKr': "Nada rojo",
	'BLANKg': "Nada verde",
	'BLANKb': "Nada azul",
	'BLANKy': "Nada amarillo",
	'INTERCHANGEr': "Intercambio rojo",
	'INTERCHANGEg': "Intercambio verde",
	'INTERCHANGEb': "Intercambio azul",
	'INTERCHANGEy': "Intercambio amarillo"
}

const colorNames =
{
	r: 'Rojo',
	g: 'Verde',
	b: 'Azul',
	y: 'Amarillo'
}

function getMessage(msg, replace)
{
	let text = messages[msg];
	if(text === undefined)
	{
		console.log(colors.red(`messages.getMessage: ${msg} is not a valid message`));
		return 'This text was not set properly';
	}

	if(replace !== undefined && typeof replace === 'object')
	{
		const replaceKeys = Object.keys(replace);
		for(let i = 0; i < replaceKeys.length; i++)
		{
			text = text.replace(`%${replaceKeys[i]}%`, replace[replaceKeys[i]]);
		}
	}

	return text;
}

module.exports =
{
	getMessage,
	msgValues,
	cardNames,
	colorNames
}
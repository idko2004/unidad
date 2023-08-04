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
	if(cardsProperties === undefined)
	{
		floatingWindow(
		{
			title: 'Espera un momento',
			text: 'La parte encargada de las propiedades de las cartas está tardando un poco en llegar, seguro que todavía ni salió de su casa.',
			button:
			{
				text: 'Vaya...',
				callback: closeWindow
			}
		});
		return;
	}

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



////
////	CARD DEX
////

const cardDex =
{
	'1r':
	{
		name: "1 rojo",
		text: "Es un 1 de color rojo, nada especial."
	},
	'2r':
	{
		name: "2 rojo",
		text: "Es un 2 de color rojo, nada especial."
	},
	'3r':
	{
		name: "3 rojo",
		text: "Es un 3 de color rojo, nada especial."
	},
	'4r':
	{
		name: "4 rojo",
		text: "Es un 4 de color rojo, nada especial."
	},
	'5r':
	{
		name: "5 rojo",
		text: "Es un 5 de color rojo, nada especial."
	},
	'6r':
	{
		name: "6 rojo",
		text: "Es un 6 de color rojo, nada especial."
	},
	'7r':
	{
		name: "7 rojo",
		text: "Es un 7 de color rojo, nada especial."
	},
	'8r':
	{
		name: "8 rojo",
		text: "Es un 8 de color rojo, nada especial."
	},
	'9r':
	{
		name: "9 rojo",
		text: "Es un 9 de color rojo, nada especial."
	},
	'0r':
	{
		name: "0 rojo",
		text: "A pesar de su apariencia, esta carta es muy poderosa.\n\nJugando esta carta puedes cambiar tu mazo con otro jugador.\n\nEs recomendable no cambiar tu mazo con nadie cuando vas a ganar."
	},
	'1g':
	{
		name: "1 verde",
		text: "Es un 1 de color verde, nada especial."
	},
	'2g':
	{
		name: "2 verde",
		text: "Es un 2 de color verde, nada especial."
	},
	'3g':
	{
		name: "3 verde",
		text: "Es un 3 de color verde, nada especial."
	},
	'4g':
	{
		name: "4 verde",
		text: "Es un 4 de color verde, nada especial."
	},
	'5g':
	{
		name: "5 verde",
		text: "Es un 5 de color verde, nada especial."
	},
	'6g':
	{
		name: "6 verde",
		text: "Es un 6 de color verde, nada especial."
	},
	'7g':
	{
		name: "7 verde",
		text: "Es un 7 de color verde, nada especial."
	},
	'8g':
	{
		name: "8 verde",
		text: "Es un 8 de color verde, nada especial."
	},
	'9g':
	{
		name: "9 verde",
		text: "Es un 9 de color verde, nada especial."
	},
	'0g':
	{
		name: "0 verde",
		text: "A pesar de su apariencia, esta carta es muy poderosa.\n\nJugando esta carta puedes cambiar tu mazo con otro jugador.\n\nEs recomendable no cambiar tu mazo con nadie cuando vas a ganar."
	},
	'1b':
	{
		name: "1 azul",
		text: "Es un 1 de color azul, nada especial."
	},
	'2b':
	{
		name: "2 azul",
		text: "Es un 2 de color azul, nada especial."
	},
	'3b':
	{
		name: "3 azul",
		text: "Es un 3 de color azul, nada especial."
	},
	'4b':
	{
		name: "4 azul",
		text: "Es un 4 de color azul, nada especial."
	},
	'5b':
	{
		name: "5 azul",
		text: "Es un 5 de color azul, nada especial."
	},
	'6b':
	{
		name: "6 azul",
		text: "Es un 6 de color azul, nada especial."
	},
	'7b':
	{
		name: "7 azul",
		text: "Es un 7 de color azul, nada especial."
	},
	'8b':
	{
		name: "8 azul",
		text: "Es un 8 de color azul, nada especial."
	},
	'9b':
	{
		name: "9 azul",
		text: "Es un 9 de color azul, nada especial."
	},
	'0b':
	{
		name: "0 azul",
		text: "A pesar de su apariencia, esta carta es muy poderosa.\n\nJugando esta carta puedes cambiar tu mazo con otro jugador.\n\nEs recomendable no cambiar tu mazo con nadie cuando vas a ganar."
	},
	'1y':
	{
		name: "1 amarillo",
		text: "Es un 1 de color amarillo, nada especial."
	},
	'2y':
	{
		name: "2 amarillo",
		text: "Es un 2 de color amarillo, nada especial."
	},
	'3y':
	{
		name: "3 amarillo",
		text: "Es un 3 de color amarillo, nada especial."
	},
	'4y':
	{
		name: "4 amarillo",
		text: "Es un 4 de color amarillo, nada especial."
	},
	'5y':
	{
		name: "5 amarillo",
		text: "Es un 5 de color amarillo, nada especial."
	},
	'6y':
	{
		name: "6 amarillo",
		text: "Es un 6 de color amarillo, nada especial."
	},
	'7y':
	{
		name: "7 amarillo",
		text: "Es un 7 de color amarillo, nada especial."
	},
	'8y':
	{
		name: "8 amarillo",
		text: "Es un 8 de color amarillo, nada especial."
	},
	'9y':
	{
		name: "9 amarillo",
		text: "Es un 9 de color amarillo, nada especial."
	},
	'0y':
	{
		name: "0 amarillo",
		text: "A pesar de su apariencia,esta carta es muy poderosa.\n\nJugando esta carta puedes cambiar tu mazo con otro jugador.\n\nEs recomendable no cambiar tu mazo con nadie cuando vas a ganar."
	},
	'+2r':
	{
		name: "+2 rojo",
		text: "Esta es una carta especial.\n\nCuando se juega, añade 2 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +2, un +4 o +6 del mismo color, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+2g':
	{
		name: "+2 verde",
		text: "Esta es una carta especial.\n\nCuando se juega, añade 2 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +2, un +4 o +6 del mismo color, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+2b':
	{
		name: "+2 azul",
		text: "Esta es una carta especial.\n\nCuando se juega, añade 2 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +2, un +4 o +6 del mismo color, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+2y':
	{
		name: "+2 amarillo",
		text: "Esta es una carta especial.\n\nCuando se juega, añade 2 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +2, un +4 o +6 del mismo color, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa del mismo color, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+4':
	{
		name: "+4",
		text: "Esta es una carta especial.\n\nCuando se juega, añade 4 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +4, un +2 o +6, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo para evitar completamente las cartas, o una carta reversa, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+6r':
	{
		name: "+6 rojo",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade 6 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +6, un +2 del mismo color o un +4, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa del mismo color, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+6g':
	{
		name: "+6 verde",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade 6 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +6, un +2 del mismo color o un +4, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa del mismo color, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+6b':
	{
		name: "+6 azul",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade 6 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +6, un +2 del mismo color o un +4, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa del mismo color, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'+6y':
	{
		name: "+6 amarillo",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade 6 cartas al mazo del siguiente jugador.\n\nPuede evitarse jugando otro +6, un +2 del mismo color o un +4, en cuyo caso se sumarán al número de cartas que el próximo jugador debe recibir.\n\nTambién puede usarse una carta bloqueo del mismo color para evitar completamente las cartas, o una carta reversa del mismo color, haciendo que el jugador anterior reciba todas las cartas sin posibilidad de defenderse."
	},
	'BLOCKr':
	{
		name: "Bloqueo rojo",
		text: "Esta es una carta especial.\n\nCuando se juega, salta el turno del siguiente jugador, haciendo que juegue el que viene después de este.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se salta el turno de nadie y, en su lugar, el efecto de las cartas +2, +4 o +6 se cancela."
	},
	'BLOCKg':
	{
		name: "Bloqueo verde",
		text: "Esta es una carta especial.\n\nCuando se juega, salta el turno del siguiente jugador, haciendo que juegue el que viene después de este.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se salta el turno de nadie y, en su lugar, el efecto de las cartas +2, +4 o +6 se cancela."
	},
	'BLOCKb':
	{
		name: "Bloqueo azul",
		text: "Esta es una carta especial.\n\nCuando se juega, salta el turno del siguiente jugador, haciendo que juegue el que viene después de este.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se salta el turno de nadie y, en su lugar, el efecto de las cartas +2, +4 o +6 se cancela."
	},
	'BLOCKy':
	{
		name: "Bloqueo amarillo",
		text: "Esta es una carta especial.\n\nCuando se juega, salta el turno del siguiente jugador, haciendo que juegue el que viene después de este.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se salta el turno de nadie y, en su lugar, el efecto de las cartas +2, +4 o +6 se cancela."
	},
	'REVERSEr':
	{
		name: "Reversa rojo",
		text: "Esta es una carta especial.\n\nCuando se juega, cambia la dirección de los turnos, haciendo que vayan en sentido contrario.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se cambia la dirección de los turnos y, en su lugar, el efecto de las cartas +2, +4 o +6 se aplican al jugador del turno anterior."
	},
	'REVERSEg':
	{
		name: "Reversa verde",
		text: "Esta es una carta especial.\n\nCuando se juega, cambia la dirección de los turnos, haciendo que vayan en sentido contrario.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se cambia la dirección de los turnos y, en su lugar, el efecto de las cartas +2, +4 o +6 se aplican al jugador del turno anterior."
	},
	'REVERSEb':
	{
		name: "Reversa azul",
		text: "Esta es una carta especial.\n\nCuando se juega, cambia la dirección de los turnos, haciendo que vayan en sentido contrario.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se cambia la dirección de los turnos y, en su lugar, el efecto de las cartas +2, +4 o +6 se aplican al jugador del turno anterior."
	},
	'REVERSEy':
	{
		name: "Reversa amarillo",
		text: "Esta es una carta especial.\n\nCuando se juega, cambia la dirección de los turnos, haciendo que vayan en sentido contrario.\n\nSi quien juega la carta está a punto de recibir cartas a causa de un +2, +4 o +6, no se cambia la dirección de los turnos y, en su lugar, el efecto de las cartas +2, +4 o +6 se aplican al jugador del turno anterior."
	},
	'COLOR':
	{
		name: "Cambiacolor",
		text: "Esta es una carta especial.\n\nPermite elegir una carta de color para que el siguiente jugador tenga que jugar una carta de ese color o una carta blanca.\n\nCuando se juega se cambia por un cambiacolor del color que hayas escogido."
	},
	'COLORr':
	{
		name: "Cambiacolor rojo",
		text: "Esta es una carta especial.\n\nSi se juega esta carta, el siguiente jugador tendrá que jugar una carta de color rojo o blanco."
	},
	'COLORg':
	{
		name: "Cambiacolor verde",
		text: "Esta es una carta especial.\n\nSi se juega esta carta, el siguiente jugador tendrá que jugar una carta de color verde o blanco."
	},
	'COLORb':
	{
		name: "Cambiacolor azul",
		text: "Esta es una carta especial.\n\nSi se juega esta carta, el siguiente jugador tendrá que jugar una carta de color azul o blanco."
	},
	'COLORy':
	{
		name: "Cambiacolor amarillo",
		text: "Esta es una carta especial.\n\nSi se juega esta carta, el siguiente jugador tendrá que jugar una carta de color amarillo o blanco."
	},
	'+1r':
	{
		name: "+1 rojo para todos",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade una carta al mazo de todos los demás jugadores sin posibilidad de defenderse."
	},
	'+1g':
	{
		name: "+1 verde para todos",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade una carta al mazo de todos los demás jugadores sin posibilidad de defenderse."
	},
	'+1b':
	{
		name: "+1 azul para todos",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade una carta al mazo de todos los demás jugadores sin posibilidad de defenderse."
	},
	'+1y':
	{
		name: "+1 amarillo para todos",
		text: "Esta es una carta muy especial.\n\nCuando se juega, añade una carta al mazo de todos los demás jugadores sin posibilidad de defenderse."
	},
	'BLANKr':
	{
		name: "Nada rojo",
		text: "Esta es una carta muy especial, aunque... en realidad, no hace nada.\n\nSolo puede jugarse cuando la carta en la mesa es de color rojo."
	},
	'BLANKg':
	{
		name: "Nada verde",
		text: "Esta es una carta muy especial, aunque... en realidad, no hace nada.\n\nSolo puede jugarse cuando la carta en la mesa es de color verde."
	},
	'BLANKb':
	{
		name: "Nada azul",
		text: "Esta es una carta muy especial, aunque... en realidad, no hace nada.\n\nSolo puede jugarse cuando la carta en la mesa es de color azul."
	},
	'BLANKy':
	{
		name: "Nada amarillo",
		text: "Esta es una carta muy especial, aunque... en realidad, no hace nada.\n\nSolo puede jugarse cuando la carta en la mesa es de color amarillo."
	}
}

function showCardDexInfo(objCard)
{
	const card = objCard.getAttribute('card');
	if(card === null)
	{
		floatingWindow(
		{
			title: '???',
			text: 'Al parecer, no existe información sobre esa carta.',
			button:
			{
				text: 'Vaya...',
				callback: closeWindow
			}
		});
		return;
	}

	const dex = cardDex[card];
	if(dex === undefined)
	{
		floatingWindow(
		{
			title: '???',
			text: 'Al parecer, no existe información sobre esa carta.',
			button:
			{
				text: 'Vaya...',
				callback: closeWindow
			}
		});
		return;
	}

	floatingWindow(
	{
		title: dex.name,
		text: dex.text,
		button:
		{
			text: 'Cerrar',
			callback: closeWindow
		}
	});
}
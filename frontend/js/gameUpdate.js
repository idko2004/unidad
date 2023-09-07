
//Cada que el servidor envía la operación gameUpdate, lo cuál ocurre cada que alguien juega su turno.
function gameUpdate(response)
{
	updateCurrentCard(response.currentCard);
	newMessages(response.messages);
	updateDeck(response.deck);
	updateBackgroundColor(response.yourTurn);
	
	canPlay = response.yourTurn;

	canSkipDirectly = response.defend;
	canGrabACard = !response.defend || true;
	changeSkipCondition(response.defend || false);
	changeDefendTextState(response.defend || false);
}

//Cuando soplas
function blowResponse(response)
{
	updateDeck(response.deck);
}


//Cada que el servidor envía la operación grabCard, lo cuál ocurre cada que el jugador agarra una carta del mazo (la carta con el + de abajo).
function grabCard(response)
{
	if(response.error !== undefined)
	{
		if(response.error === 'alredyGrabbed')
		{
			floatingWindow(
			{
				title: 'Nop',
				text: 'Ya has tomado una carta.',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			return;
		}
		else
		{
			floatingWindow(
			{
				title: 'Algo salió mal',
				text: `error: ${response.error}`,
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			return;
		}
	}

	const card = response.card;
	createCardsInDeck([card]);
	//playerDeck.push(card);
	//console.log('deck después de agarrar una carta', playerDeck);
	changeSkipCondition(true);
	canGrabACard = false;
}



//Cuando el servidor envía la operación gameEnd, la cuál ocurre cuando un jugador ganó la partida.
function gameEnd(response)
{
	yourTurn = false;
	updateCurrentCard(response.currentCard);
	updateDeck(response.deck);

	if(response.youWin) winAnimation();
	else loseAnimation(response.winner);
}



//Cuando el servidor envía la operación errorPlaying, lo cuál ocurre cuando se envían datos inválidos o ha ocurrido un error.
function errorPlaying(response)
{
	switch(response.error)
	{
		default:
			floatingWindow(
			{
				title: 'Algo salió mal',
				text: `error: ${response.error}`,
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'invalidCard':
			floatingWindow(
			{
				title: 'Esa carta no',
				text: 'Elige una carta que tenga el mismo color o contenido',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'grabCardFirst':
			floatingWindow(
			{
				title: 'Toma una carta del mazo',
				text: 'No puedes saltar tu turno si no tomas una carta del mazo antes',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'cantBlowSpecial':
			floatingWindow(
			{
				title: 'Esa carta no',
				text: 'Las cartas especiales o muy especiales no se pueden soplar.',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'cantDefendWithThat':
			floatingWindow(
			{
				title: 'Esa carta no',
				text: 'Esa carta no podrá salvarte de tu destino.',
				button:
				{
					text: ":´(",
					callback: closeWindow
				}
			});
			break;

		case 'defendGimmickDisabled':
			floatingWindow(
			{
				title: 'Reglas modificadas',
				text: 'En esta sala se ha deshabilitado la opción de defenderse usando cartas bloqueo o reversa.',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'zeroInterchangeDisabled':
			floatingWindow(
			{
				title: 'Reglas modificadas',
				text: 'En esta sala se ha deshabilitado la opción de intercambiar mazos usando una carta 0.',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'blowDisabled':
			floatingWindow(
			{
				title: 'Reglas modificadas',
				text: 'En esta sala se ha deshabilitado la opción de soplar.',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'kickedForInactivity':
			floatingWindow(
			{
				title: 'Expulsado por inactividad',
				text: 'Han pasado unos cuantos turnos sin que juegues, así que el servidor te ha expulsado.',
				button:
				{
					text: 'Aceptar',
					callback: async function()
					{
						await closeWindow();
						location.reload();
					}
				}
			});
			break;

		case 'roomDeleted':
			floatingWindow(
			{
				title: 'Sala borrada',
				text: 'La sala se ha borrado.',
				button:
				{
					text: 'Aceptar',
					callback: async function()
					{
						await closeWindow();
						location.reload();
					}
				}
			});
			break;
	}
}



//Cuando sales de la partida y te vuelves a unir
function rejoined(response)
{
	askForCardProperties();

	roomID = response.roomID;
	players = response.players;
	key = response.key;
	roomRules = response.rules;

	startGame(response);
}

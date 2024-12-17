let currentMenu;

function changeMenus(menu)
{
	document.getElementById('mainMenu').hidden = true;
	document.getElementById('createGameMenu').hidden = true;
	document.getElementById('findGameMenu').hidden = true;
	document.getElementById('waitForPlayersMenu').hidden = true;
	document.getElementById('game').hidden = true;
	document.getElementById('serverMenu').hidden = true;
	document.getElementById('localServerMenu').hidden = true;
	document.getElementById('loadingScreen').hidden = true;

	currentMenu = menu;

	switch(menu)
	{
		case 'loading':
			document.getElementById('loadingScreen').hidden = false;
			break;

		case 'main':
			document.getElementById('mainMenu').hidden = false;
			break;

		case 'findGame':
			document.getElementById('findGameMenu').hidden = false;
			break;

		case 'createGame':
			document.getElementById('createGameMenu').hidden = false;
			break;

		case 'waitPlayers':
			document.getElementById('waitForPlayersMenu').hidden = false;
			break;

		case 'game':
			document.getElementById('game').hidden = false;
			break;

		case 'server':
			document.getElementById('serverMenu').hidden = false;
			break;

		case 'localServer':
			document.getElementById('localServerMenu').hidden = false;
			break;
	}
}

//
//	SERVER MENU
//

document.getElementById('onlineServerButton').addEventListener('click', function()
{
	changeMenus('loading');
	url = `ws://${gameserver}`;
	connectToServer();
	updateServerLabel(gameserver);
});

document.getElementById('localServerButton').addEventListener('click', function()
{
	changeMenus('localServer');
});

document.getElementById('connectCustomServerButton').addEventListener('click', function()
{
	const input = document.getElementById('customUrlField').value.trim();

	changeMenus('loading');

	url = `ws://${input}`;

	connectToServer();
	updateServerLabel(input);
});

document.getElementById('customServerBackButton').addEventListener('click', function()
{
	changeMenus('server');
});

document.getElementById('customUrlField').addEventListener('keyup', function(e)
{
	if(e.key === 'Enter') document.getElementById('connectCustomServerButton').click();
});

//
//	MAIN MENU
//

document.getElementById('mainMenuToCreateGame').addEventListener('click', function()
{
	changeMenus('createGame');
});

document.getElementById('mainMenuToFindGame').addEventListener('click', function()
{
	changeMenus('findGame');
});

document.getElementById('createGameBack').addEventListener('click', function()
{
	changeMenus('main');
});

document.getElementById('searchGameBack').addEventListener('click', function()
{
	changeMenus('main');
});

function updateServerLabel(server)
{
	if(server === null) document.getElementById('serverLabelContainer').hidden = true;
	else
	{
		document.getElementById('serverLabelContainer').hidden = false;
		document.getElementById('serverLabel').innerText = `Conectado al servidor ${server}`;
	}
}

//
//	SEARCH FOR GAME
//

document.getElementById('searchGameButton').addEventListener('click', function()
{
	if(!connected) return;

	username = document.getElementById('searchGameUsername').value;
	if(username === undefined) return;
	
	username = username.trim();
	if(username === '') return;


	roomID = document.getElementById('searchGameRoom').value;
	if(roomID === undefined) return;

	roomID = roomID.trim().toLowerCase();
	if(roomID === '') return;

	let obj =
	{
		operation: 'joinGame',
		username,
		roomID
	};

	ws.send(JSON.stringify(obj));

	gameMaster = false;
	changeMenus('loading');

	document.getElementById('searchGameRoom').value = '';
});

document.getElementById('searchGameUsername').addEventListener('keyup', function(e)
{
	if(e.key === 'Enter') document.getElementById('searchGameRoom').focus();
});

document.getElementById('searchGameRoom').addEventListener('keyup', function(e)
{
	if(e.key === 'Enter') document.getElementById('searchGameButton').click();
});

//
//	CREATE GAME
//

document.getElementById('createGameButton').addEventListener('click', function()
{
	if(!connected) return;

	username = document.getElementById('createGameUsername').value;
	if(username === undefined) return;
	
	username = username.trim();
	if(username === '') return;


	let obj =
	{
		operation: 'createGame',
		username
	};

	if(roomRules.modifyRules) obj.rules =
	{
		cardsAtStart: roomRules.cardsAtStart,
		moreSpecialCards: roomRules.verySpecialCards,
		defendGimmick: roomRules.defendGimmick,
		zeroInterchange: roomRules.zeroInterchange,
		blow: roomRules.blow
	}

	ws.send(JSON.stringify(obj));

	gameMaster = true;
	changeMenus('loading');
});

document.getElementById('createGameUsername').addEventListener('keyup', function(e)
{
	if(e.key === 'Enter') document.getElementById('createGameButton').click();
});

//
//	Opciones en create game
//

function updateCreateGameOptions()
{
	//Si se van a modificar las reglas, el menú de modificar reglas debe mostrarse
	document.getElementById('createGameOptionsMenu').hidden = !roomRules.modifyRules;

	//El texto del botón de mostrar o ocultar el menú
	if(roomRules.modifyRules) document.getElementById('createGameOptionsButton').innerText = 'Dejar las reglas por defecto';
	else document.getElementById('createGameOptionsButton').innerText = 'Modificar algunas reglas';

	//Número de cartas al comienzo
	document.getElementById('createGameCardsNumber').value = roomRules.cardsAtStart;

	//Cartas muy especiales
	if(roomRules.verySpecialCards)
	{
		document.getElementById('createGameSpecialCardsState').innerText = "Activado";
		document.getElementById('createGameSpecialCards').innerText = "Desactivar";
	}
	else
	{
		document.getElementById('createGameSpecialCardsState').innerText = "Desactivado";
		document.getElementById('createGameSpecialCards').innerText = "Activar";
	}

	//Gimmick de defensa
	if(roomRules.defendGimmick)
	{
		document.getElementById('createGameDefendState').innerText = "Activado";
		document.getElementById('createGameDefend').innerText = "Desactivar";
	}
	else
	{
		document.getElementById('createGameDefendState').innerText = "Desactivado";
		document.getElementById('createGameDefend').innerText = "Activar";
	}

	//Intercambiar mazos con 0
	if(roomRules.zeroInterchange)
	{
		document.getElementById('createGameInterchangeZeroState').innerText = "Activado";
		document.getElementById('createGameInterchangeZero').innerText = "Desactivar";
	}
	else
	{
		document.getElementById('createGameInterchangeZeroState').innerText = "Desactivado";
		document.getElementById('createGameInterchangeZero').innerText = "Activar";
	}

	//Soplar
	if(roomRules.blow)
	{
		document.getElementById('createGameBlowState').innerText = "Activado";
		document.getElementById('createGameBlow').innerText = "Desactivar";
	}
	else
	{
		document.getElementById('createGameBlowState').innerText = "Desactivado";
		document.getElementById('createGameBlow').innerText = "Activar";
	}
}

document.getElementById('createGameOptionsButton').addEventListener('click', function()
{
	roomRules.modifyRules = !roomRules.modifyRules;
	updateCreateGameOptions();
});

document.getElementById('createGameCardsNumber').addEventListener('change', function(e)
{
	let number = parseInt(e.target.value);

	if(isNaN(number) || number < 2)
	{
		e.target.value = 7;
		roomRules.cardsAtStart = 7;
		return;
	}

	roomRules.cardsAtStart = number;
});

document.getElementById('createGameSpecialCards').addEventListener('click', function()
{
	roomRules.verySpecialCards = !roomRules.verySpecialCards;
	updateCreateGameOptions();
});

document.getElementById('createGameDefend').addEventListener('click', function()
{
	roomRules.defendGimmick = !roomRules.defendGimmick;
	updateCreateGameOptions();
});

document.getElementById('createGameInterchangeZero').addEventListener('click', function()
{
	roomRules.zeroInterchange = !roomRules.zeroInterchange;
	updateCreateGameOptions();
});

document.getElementById('createGameBlow').addEventListener('click', function()
{
	roomRules.blow = !roomRules.blow;
	updateCreateGameOptions();
});

//
//	WAIT FOR PLAYERS MENU
//

function joinedToGame(response)
{
	if(response.error !== undefined)
	{
		switch(response.error)
		{
			case 'cantFindRoom':
				floatingWindow(
				{
					title: 'La sala no existe',
					text: '¿Has copiado bien el ID de la sala?',
					button:
					{
						text: 'No',
						callback: async function()
						{
							await closeWindow();
							changeMenus('findGame');
						}
					}
				});
				break;

			case 'gameAlredyStarted':
				floatingWindow(
				{
					title: 'Parece que llegas tarde',
					text: 'La partida ya ha comenzado\n\nSi ya estabas antes y te saliste, espera un momento y vuelve a intentarlo',
					button:
					{
						text: ':(',
						callback: async function()
						{
							await closeWindow();
							changeMenus('findGame');
						}
					}
				});
				break;

			case 'roomIsFull':
				floatingWindow(
				{
					title: 'Ya no queda sitio',
					text: 'La sala está llena',
					button:
					{
						text: ':(',
						callback: async function()
						{
							await closeWindow();
							changeMenus('findGame');
						}
					}
				});
				break;

			case 'invalidName':
				floatingWindow(
				{
					title: 'Prueba con otro nombre',
					text: 'Parece que hay un problema con tu nombre de usuario, o es posible que otro jugador ya lo haya utilizado.',
					button:
					{
						text: 'Vaya...',
						callback: async function()
						{
							await closeWindow();
							changeMenus('findGame');
						}
					}
				});
				break;

			case 'invalidRules':
				floatingWindow(
				{
					title: 'Hay un problema',
					text: 'Una de las reglas de la sala parece que no es válida',
					button:
					{
						text: 'Aceptar',
						callback: async function()
						{
							await closeWindow();
							changeMenus('createGame');
						}
					}
				});
				break;

			default:
				floatingWindow(
				{
					title: 'Algo salió mal',
					text: `El error que el servidor envió:\n\n${response.error}`,
					button:
					{
						text: '¡Oh no!',
						callback: async function()
						{
							await closeWindow();
							changeMenus('findGame');
						}
					}
				});
				break;
		}
		return;
	}

	roomID = response.roomID;
	key = response.key;
	players = response.players;
	roomRules = response.rules;
	document.getElementById('waitRoomID').innerText = response.roomID;

	for(let i = 0; i < response.players.length; i++)
	{
		addPlayerToWaitingList(response.players[i]);
	}

	askForCardProperties();
	updateStartGameButton();
	changeMenus('waitPlayers');
}

function playerJoined(response)
{
	players.push(response.username);
	addPlayerToWaitingList(response.username);

	updateStartGameButton();
}

function addPlayerToWaitingList(playerName)
{
	const playersList = document.getElementById('playersList');

	const playerInTheList = document.createElement('div');
	playerInTheList.classList.add('playerInTheList');

	const span = document.createElement('span');
	span.innerText = playerName;
	playerInTheList.appendChild(span);

	if(gameMaster)
	{
		const btnFloatRight = document.createElement('button');
		btnFloatRight.classList.add('btnFloatRight');
		btnFloatRight.innerText = '(X)';
		btnFloatRight.setAttribute('kick', playerName);
		
		btnFloatRight.addEventListener('click', function(e)
		{
			e.target.innerText = '...';
			const kick = e.target.getAttribute('kick');
			if(kick === null)
			{
				floatingWindow(
				{
					title: 'Algo salió mal',
					text: 'No se pudo expulsar a este jugador'
				});
				return;
			}
			else kickPlayer(kick);
		});

		playerInTheList.appendChild(btnFloatRight);
	}

	playersList.appendChild(playerInTheList);
}

let autoExpulsion = false; //Se vuelve true cuando te expulsas de la partida

function kickPlayer(playerName)
{
	ws.send(JSON.stringify(
	{
		operation: 'kickPlayer',
		key,
		roomID,
		kick: playerName
	}));
}

function playerKicked(response)
{
	//players = response.remainingPlayers;
	players = [];
	gameMaster = response.nowYoureMaster;

	if(!response.remainingPlayers.includes(username))
	{
		if(!autoExpulsion)
		{
			if(response.remainingPlayers.length === 0)
			{
				floatingWindow(
				{
					title: 'La sala ha cerrado',
					text: 'Todos han salido de la sala o han sido expulsados.',
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
				return;
			}
			else 
			{
				floatingWindow(
				{
					title: 'Te han expulsado',
					text: 'El administrador te ha expulsado de la sala.',
					button:
					{
						text: ':(',
						callback: async function()
						{
							await closeWindow();
							location.reload();
						}
					}
				});
				return;
			}
		}
		else
		{
			location.reload();
			return;
		}
	}

	document.getElementById('playersList').innerHTML = '';

	for(let i = 0; i < response.remainingPlayers.length; i++)
	{
		playerJoined(
		{
			username: response.remainingPlayers[i]
		});
	}

	if(currentMenu === 'game')
	{
		canPlay = response.nowIsYourTurn;
		updateBackgroundColor(response.nowIsYourTurn);
		
		if(response.nowIsYourTurn) newMessages(['Expulsaron a alguien', 'Tu turno']);
		else newMessages(['Expulsaron a alguien']);

		if(response.defend) changeDefendTextState(true);
	}
	else updateStartGameButton();
}

function updateStartGameButton()
{
	if(!gameMaster)
	{
		document.getElementById('waitStartButton').hidden = true;
	}
	else
	{
		document.getElementById('waitStartButton').hidden = false;

		if(players.length > 1)
		{
			document.getElementById('waitingPlayersText').hidden = true;
			document.getElementById('waitStartButton').disabled = false;
		}
		else
		{
			document.getElementById('waitingPlayersText').hidden = false;
			document.getElementById('waitStartButton').disabled = true;
		}
	}
}

document.getElementById('waitStartButton').addEventListener('click', function(e)
{
	if(!gameMaster) return;

	if(players.length < 2) return;

	changeMenus('loading');

	ws.send(JSON.stringify(
	{
		operation: 'startGame',
		roomID,
		key
	}));
});

document.getElementById('waitExitButton').addEventListener('click', function()
{
	changeMenus('loading');
	autoExpulsion = true;
	kickPlayer(username);
});

///
/// IN-GAME MENU
///

document.getElementById('gameMenu').addEventListener('click', function()
{
	const list = [];
	list.push(
	{
			text: 'Salir del juego',
			callback: async function()
			{
				await closeWindow();
				changeMenus('loading');
				autoExpulsion = true;
				kickPlayer(username);
			}
	});

	if(gameMaster) list.push(
	{
		text: 'Expulsar a alguien',
		callback: async function()
		{
			await closeWindow();

			const expulsionList = [];

			for(let i = 0; i < players.length; i++)
			{
				expulsionList.push(
				{
					text: players[i],
					callback: async function()
					{
						await closeWindow();
						kickPlayer(players[i]);
					}
				});
			}

			floatingWindow(
			{
				title: 'Expulsar a alguien',
				list: expulsionList,
				button:
				{
					text: 'Cancelar',
					callback: closeWindow
				}
			});
		}
	});

	list.push(
	{
			text: 'Mi mazo se ha roto',
			callback: async function()
			{
				await closeWindow();
				document.getElementById('deck').innerHTML = '';
				createCardsInDeck(playerDeck);
			}
	});

	list.push(
	{
		text: 'Acerca de Unidad',
		callback: async function()
		{
			await closeWindow();
			let a = document.createElement('a');
			a.setAttribute('href', 'about.html');
			a.setAttribute('target', '_blank');
			a.hidden = true;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
	});

	floatingWindow(
	{
		title: 'Menú',
		list,
		button:
		{
			text: 'Cerrar',
			callback: closeWindow
		}
	});
});

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
	url = onlineUrl;
	changeMenus('loading');
	connectToServer();
});

document.getElementById('localServerButton').addEventListener('click', function()
{
	changeMenus('localServer');
});

document.getElementById('connectCustomServerButton').addEventListener('click', function()
{
	const input = document.getElementById('customUrlField').value;

	changeMenus('loading');

	url = `ws://${input}`;

	connectToServer();
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
})

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

	roomID = roomID.trim();
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


	let numberOfPlayers = parseInt(document.getElementById('createGamePlayers').value);
	if(isNaN(numberOfPlayers)
	|| numberOfPlayers < 2
	|| numberOfPlayers > 10)
	{
		floatingWindow(
		{
			title: 'El número de jugadores está mal',
			text: 'La cantidad de jugadores debe estar entre 2 y 10',
			button:
			{
				text: 'Aceptar',
				callback: closeWindow
			}
		});
		return;
	}

	maxPlayers = numberOfPlayers;

	let obj =
	{
		operation: 'createGame',
		username,
		maxPlayers
	};

	ws.send(JSON.stringify(obj));

	gameMaster = true;
	changeMenus('loading');
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
					text: 'La partida ya ha comenzado',
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
	players = response.players;
	document.getElementById('waitRoomID').innerText = response.roomID;

	for(let i = 0; i < response.players.length; i++)
	{
		addPlayerToWaitingList(response.players[i]);
	}

	askForCardProperties();
	changeMenus('waitPlayers');
}

function playerJoined(response)
{
	players.push(response.username);
	addPlayerToWaitingList(response.username);

	//Hacer aparecer el botón de empezar
	if(gameMaster && (players.length === maxPlayers))
	{
		document.getElementById('waitStartButton').hidden = false;
	}
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
		playerInTheList.appendChild(btnFloatRight);	
	}

	playersList.appendChild(playerInTheList);
}

document.getElementById('waitStartButton').addEventListener('click', function(e)
{
	if(!gameMaster) return;

	if(players.length < maxPlayers) return;

	ws.send(JSON.stringify(
	{
		operation: 'startGame',
		roomID,
		username
	}));

	e.target.innerText = 'Iniciando juego...';
});
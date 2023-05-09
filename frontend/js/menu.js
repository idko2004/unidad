function changeMenus(menu)
{
	document.getElementById('findGameMenu').hidden = true;
	document.getElementById('waitForPlayersMenu').hidden = true;
	document.getElementById('game').hidden = true;

	switch(menu)
	{
		case 'findGame':
			document.getElementById('findGameMenu').hidden = false;
			break;

		case 'waitPlayers':
			document.getElementById('waitForPlayersMenu').hidden = false;
			break;

		case 'game':
			document.getElementById('game').hidden = false;
			break;
	}
}

//
//  SEARCH FOR GAME
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
	changeMenus('waitPlayers');
});

//
//  CREATE GAME
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
	|| numberOfPlayers < 1
	|| numberOfPlayers > 10)
	{
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
	changeMenus('waitPlayers');
});

//
//  WAIT FOR PLAYERS MENU
//

function joinedToGame(response)
{
	roomID = response.roomID;
	players = response.players;
	document.getElementById('waitRoomID').innerText = response.roomID;

	for(let i = 0; i < response.players.length; i++)
	{
		addPlayerToWaitingList(response.players[i]);
	}
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
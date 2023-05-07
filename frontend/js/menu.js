function changeMenus(menu)
{
	document.getElementById('findGameMenu').hidden = true;
	document.getElementById('waitForPlayersMenu').hidden = true;

	switch(menu)
	{
		case 'findGame':
			document.getElementById('findGameMenu').hidden = false;
			break;

		case 'waitPlayers':
			document.getElementById('waitForPlayersMenu').hidden = false;
			break;
	}
}

//
//  SEARCH FOR GAME
//

document.getElementById('searchGameButton').addEventListener('click', function()
{
	if(!connected) return;

	let username = document.getElementById('searchGameUsername').value;
	if(username === undefined) return;
	
	username = username.trim();
	if(username === '') return;


	let roomID = document.getElementById('searchGameRoom').value;
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

	let username = document.getElementById('createGameUsername').value;
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

	let obj =
	{
		operation: 'createGame',
		username,
		maxPlayers: numberOfPlayers
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
	document.getElementById('waitRoomID').innerText = response.roomID;

	if(gameMaster)
	{
		document.getElementById('waitStartButton').hidden = false;
	}

	for(let i = 0; i < response.players.length; i++)
	{
		addPlayerToWaitingList(response.players[i]);
	}
}

function playerJoined(response)
{
	addPlayerToWaitingList(response.username);
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
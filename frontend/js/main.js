const url = 'ws://localhost:8888';

let connected = false;

const ws = new WebSocket(url);

ws.addEventListener('open', function(e)
{
	console.log('¡Conectado al servidor!');
	connected = true;
});

ws.addEventListener('message', function(e)
{
	console.log(e);
})

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
});

/*document.getElementById('sendMessage').addEventListener('click', function()
{
	if(!connected) return;

	ws.send('hola');
});*/

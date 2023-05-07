const url = 'ws://localhost:8888';

let connected = false;

let gameMaster = false;

const ws = new WebSocket(url);

ws.addEventListener('open', function(e)
{
	console.log('¡Conectado al servidor!');
	connected = true;
});

ws.addEventListener('message', function(e)
{
	console.log(e);
	try
	{
		const response = JSON.parse(e.data);
		console.log(response);

		parseOperations(response);
	}
	catch(err)
	{
		console.log(err);
	}
});

const ws = new WebSocket(url);

ws.addEventListener('open', function(e)
{
	console.log('¡Conectado al servidor!');
	connected = true;
});

ws.addEventListener('error', function(e)
{
    console.log('Error conectando al servidor', e);
    connected = false;
    floatingWindow(
    {
        title: 'Algo salió mal',
        text: 'No se pudo conectar al servidor',
        button:
        {
            text: ':(',
            callback: function()
            {
                location.reload();
            }
        }
    })
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

function parseOperations(response)
{
    switch(response.operation)
    {
        case 'obtainRoomID':
            joinedToGame(response);
            break;

        case 'joinedToGame':
            joinedToGame(response);
            break;

        case 'playerJoined':
            playerJoined(response);
            break;

        case 'startGame':
            startGame(response);
            break;
    }
}

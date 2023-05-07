
module.exports = async function(data, ws)
{
	const dataString = data.toString();
	if(dataString === undefined || dataString === '') return;
	console.log(dataString);

	try
	{
		const dataObject = JSON.parse(dataString);
		console.log(dataObject);

		if(dataObject.operation === undefined) return;

		parseOperation(dataObject, ws);
	}
	catch(err)
	{
		console.log('HA OCURRIDO UN ERROR', err);
		ws.send(JSON.stringify(
		{
			operation: 'parsingData',
			error: 'cantParseData',
			errorMsg: err.message,
			errorCode: err.code
		}));
	}
}

const createGame = require('./operations/createGame');
const joinGame = require('./operations/joinGame');

function parseOperation(dataObject, ws)
{
	switch(dataObject.operation)
	{
		default:
			ws.send(JSON.stringify(
			{
				error: 'invalidOperation'
			}));
			break;

		case 'createGame':
			createGame(dataObject, ws);
			break;

		case 'joinGame':
			joinGame(dataObject, ws);
			break;
	}
}

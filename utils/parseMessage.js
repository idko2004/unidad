const colors = require('colors');

module.exports = async function(data, ws)
{
	console.log('########');
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
		console.log(colors.red('HA OCURRIDO UN ERROR'), err);
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'catastrophicError_EverythingCrashed',
			errorMsg: err.message,
			errorCode: err.code
		}));
	}
}

const createGame = require('../operations/createGame');
const joinGame = require('../operations/joinGame');
const startGame = require('../operations/startGame');
const kick = require('../operations/kick');
const play = require('../operations/play');
const blow = require('../operations/blow');
const grabCard = require('../operations/grabCard');
const skip = require('../operations/skip');
const getCardProperties = require('../operations/getCardProperties');
const debug = require('../operations/debug');

function parseOperation(dataObject, ws)
{
	switch(dataObject.operation)
	{
		default:
			ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error: 'invalidOperation'
			}));
			console.log(colors.red(`${dataObject.operation} no es una operación válida`));
			break;

		case 'createGame':
			createGame(dataObject, ws);
			break;

		case 'joinGame':
			joinGame(dataObject, ws);
			break;

		case 'startGame':
			startGame(dataObject, ws);
			break;

		case 'kickPlayer':
			kick(dataObject, ws);
			break;

		case 'play':
			play(dataObject, ws);
			break;

		case 'blow':
			blow(dataObject, ws);
			break;

		case 'grabCard':
			grabCard(dataObject, ws);
			break;

		case 'skip':
			skip(dataObject, ws);
			break;

		case 'getCardProperties':
			getCardProperties(dataObject, ws);
			break;

		case 'debug':
			debug(dataObject, ws);
			break;
	}
}

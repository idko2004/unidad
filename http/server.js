
const http = require('http');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const vars = require('../utils/env');

const httpPort = vars.env.FILES_PORT || 8910;
vars.global.filesServer = `${require('ip').address()}:${httpPort}`;

const MIME_TYPES =
{
	default: "application/octet-stream",
	html: "text/html; charset=UTF-8",
	js: "application/javascript",
	css: "text/css",
	png: "image/png",
	jpg: "image/jpg",
	gif: "image/gif",
	ico: "image/x-icon",
	svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./frontend");

const allowedPaths =
[
	'/',
	'/index.html',

	'/css/confeti.css',
	'/css/floatingWindow.css',
	'/css/game.css',
	'/css/spritesheet.css',
	'/css/style.css',

	'/img/favicon.png',
	'/img/cardsheet.png',

	'/js/cards.js',
	'/js/confeti.js',
	'/js/floatingWindow.js',
	'/js/game.js',
	'/js/gameAnimations.js',
	'/js/gameDeck.js',
	'/js/gameLogs.js',
	'/js/gameSpecialCards.js',
	'/js/gameUpdate.js',
	'/js/main.js',
	'/js/menu.js',
	'/js/spritesheet.js',
	'/js/ws.js'
];

const fileCache = {};

function startServer()
{
	http.createServer(async function(req, res)
	{
		console.log(`//http request: ${req.url}`);

		const filePath = getFilePath(req.url);
		if([undefined, null].includes(filePath))
		{
			console.log('Invalid Path');
			res.writeHead(500);
			res.end('Invalid Path');
			return;
		}

		const file = await loadFile(filePath);
		if([undefined, null].includes(filePath))
		{
			console.log('Invalid Path');
			res.writeHead(400);
			res.end('Invalid Path');
			return;
		}

		const contentType = getContentType(filePath);


		res.writeHead(200, { "Content-Type": contentType });
		res.end(file);

	}).listen(httpPort);

	console.log(colors.yellow(`Servidor del juego: ${vars.global.filesServer}\n`));
}



function getFilePath(reqpath)
{
	if(typeof reqpath !== "string") return null;

	let allowed = false;
	for(let i = 0; i < allowedPaths.length; i++)
	{
		if(allowedPaths[i] === reqpath)
		{
			allowed = true;
			continue;
		}
	}

	if(!allowed) return null;

	if(reqpath === '/') reqpath = '/index.html';

	const fullPath = STATIC_PATH + reqpath;
	console.log('fullPath', fullPath);

	return fullPath;
}



async function loadFile(fullpath)
{
	if(typeof fullpath !== "string") return null;

	let file;

	//Si el archivo se cargó antes, sacarlo de caché
	if(fileCache[fullpath] !== undefined)
	{
		file = fileCache[fullpath];
	}
	//Si no está en caché, cargar el archivo
	else try
	{
		file = await fs.promises.readFile(fullpath);
		fileCache[fullpath] = file;
	}
	catch(err)
	{
		console.log('//Ha ocurrido un error cargando el archivo', fullpath);
		return null;
	}


	//Modificar index.html
	if(fullpath === STATIC_PATH + "/index.html")
	{
		let modified = file.toString();
		modified = modified.replace('<body>', `<body gameserver="${vars.global.gameServer}">`);
		file = modified;
	}

	return file;
}



function getContentType(fullpath)
{
	if(typeof fullpath !== "string") return null;

	const dotSplit = fullpath.split('.');
	const fileExtension = dotSplit[dotSplit.length - 1];

	let contentType = MIME_TYPES[fileExtension];
	if(contentType === undefined) contentType = MIME_TYPES.default;

	return contentType;
}

module.exports = { startServer };

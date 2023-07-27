if(process.env.NODE_ENV !== 'production') require('dotenv').config();

const envVariables = process.env;

const global = {}; //Una forma de hacer variables globales sin que haya dependencias circulares

module.exports =
{
	env: envVariables,
	global
}
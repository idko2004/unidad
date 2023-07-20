if(process.env.NODE_ENV !== 'production') require('dotenv').config();

const envVariables = process.env;

module.exports = envVariables;
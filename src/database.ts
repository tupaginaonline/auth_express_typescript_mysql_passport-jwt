import varenv from 'dotenv';
varenv.config();

import mysql from 'mysql2/promise';

async function connection():Promise<mysql.Connection>{
	
	const conex = await mysql.createConnection({
		host:process.env.HOST,
		user:process.env.USER,
		database:process.env.BD
	});
	
	return conex;
	
}	
	
export default connection;
	
	


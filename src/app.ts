import varenv from 'dotenv';
varenv.config();

import express, {Application} from 'express'
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import connection from './database';
import {parseResult} from './helpers';
import {IUser} from './interfaces';
import './passportJwt';

//Seetings
const app:Application = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());


//Routes
app.get("/", (req,res) => {
	res.send(`Welcome to my API - SHOP`);
});


app.post('/login', async(req,res):Promise<express.Response> => {
	        
	const { email, password } = req.body;
	
	try{
		
		const conn = await connection();

		const [result] = await conn.query("SELECT * FROM users where email = ?", [email]);
		
		const row:IUser[] = parseResult(result);
		
		if(row.length==0){
			return res.status(400).json({msg:"The email not match"});
		}
		
		//compare password
		
		if(await bcrypt.compare(password,row[0].password)){
			
			return res.status(200).json({token:jwt.sign(row[0] , `${process.env.AUTHENTICATION_SECRET}`)});
			
		}else{
			return res.status(400).json({msg:"The password not match"});
		}
		
		
	}catch(e){
		
		return res.status(500).send(e)
		
	}
	
 
	
});

app.post("/register", async(req,res):Promise<express.Response> => {
	
	const { email, password } = req.body;
	
	//valid if exist the email
	try{
		const conn = await connection();
		const [result] =await conn.query('SELECT * FROM users where email = ?',[email]);
		
		const rows = parseResult(result);
		
		if(rows.length!==0){
			return res.status(400).json('The email already exist!!');
		}
		
		const hash = await bcrypt.hash(password, 10);
		
		const newUser = await conn.query(`INSERT INTO users (email,password) values(?,?)`,[email,hash]);
		
		return res.status(201).json({msg:"Created successfully the new User."});
		
	}catch(e){
		return res.status(500).send(e)
	}

});


app.get('/users', passport.authenticate("jwt", ({session:false})) ,async(req:any,res:express.Response):Promise<express.Response> => {
	
	 try{
		 
		const conn = await connection();
	    const [results] = await conn.query("SELECT * FROM users");
		
		const users = parseResult(results);
		
		console.log(req.user.email);
			
		return res.status(200).json({Welcome:req.user.email,users});
		 
	 }catch(err){
		return res.status(500).send();
	 }
	
});


app.delete('/logout' , (req,res):express.Response => {
	req.logout();
	
	return res.status(200).json({msg:"LogOut successfully"});
}) 


export default  app;
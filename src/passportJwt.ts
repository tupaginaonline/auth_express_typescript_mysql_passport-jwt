import varenv from 'dotenv';
varenv.config();
import {IUser} from './interfaces';
import passport from 'passport';
import { Strategy, ExtractJwt  }  from 'passport-jwt';
import connection from './database';
import {parseResult} from './helpers';

passport.use(
new Strategy({
	
jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
secretOrKey : process.env.AUTHENTICATION_SECRET
	
		}, async(payload,done) => {
			
			try{
				
				const conn = await connection();
			
				const [result] = await conn.query("SELECT * FROM users WHERE id = ?",[payload.id]);
				
				const user:IUser[] = parseResult(result);
				
				if(user.length==0){
					return done(null,false);
				}
				
				return done(null,user[0]);
				
			}catch(e){
				return done(null,false);
			}
			
		}

)
);


passport.serializeUser((user:IUser,done:Function) => {
	return done(null,user.id)
})

passport.deserializeUser(async(id:number,done:Function) => {
	
	try{
				
				const conn = await connection();
			
				const [result] = await conn.query("SELECT * FROM users WHERE id = ?",[id]);
				
				const user:IUser[] = parseResult(result);
				
				if(user.length==0){
					return done(null,false);
				}
				
				return done(null,user[0]);
				
			}catch(e){
				return done(null,false);
			}
	
})

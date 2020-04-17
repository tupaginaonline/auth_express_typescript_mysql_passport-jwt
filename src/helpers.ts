import {IUser} from './interfaces';
export const parseResult = (str:any):IUser[] => {
	
	return JSON.parse(JSON.stringify(str));
	
}
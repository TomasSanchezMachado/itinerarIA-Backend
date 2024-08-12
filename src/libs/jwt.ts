import jwt from 'jsonwebtoken';



const JWT_SECRET = 'secret';

export default function createAccessToken(payload:any){
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,JWT_SECRET,{expiresIn:'15m'},(err,token)=>{
            if(err) reject (err)
            resolve(token);})
    }   )}
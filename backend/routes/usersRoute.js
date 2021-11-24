import express from 'express';
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import passportJWT from "passport-jwt";
import dotenv from 'dotenv';
dotenv.config();
const JwtStrategy = passportJWT.Strategy;

const usersRoute = express.Router();




passport.use (new BasicStrategy(
  async (username,password,done)  => {
    const user = await User.findOne({username:username}).select("+password");
    if(!user) {
      // Username not found
   
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match */
    if(bcrypt.compareSync(password, user.password) == false) {
      // Password does not match
      
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

let jwtSecretKey = process.env.JWTKEY;


export const applyPassportStrategy = passport => {


let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecretKey;


passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  
  const now = Date.now() / 1000;
  if(jwt_payload.exp > now) {
    done(null, jwt_payload.user);
  }
  else {
    done(null, false);
  }
}));
};








usersRoute.post('/register',
        (req, res) => {

  const username = req.body.username;
  const email = req.body.email;
         

  const salt = bcrypt.genSaltSync(6);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  const password = hashedPassword

  const newUser = new User({
    username,
    email,
    password,
  });
  res.status(201);

  newUser.save().then(res.status(201).json({ message: "User created, log in" }));

});
  


usersRoute.post(
  '/Login',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    
    const body = {
      id: req.user.id,
      email : req.user.email,
      username : req.user.username
    };

    const payload = {
      user : body
    };

    const options = {
      expiresIn: '1d'
    }
    
    const token = jwt.sign(payload,  jwtSecretKey , options);

    return res.json({ token, body });
})


usersRoute.get('/haveToken',passport.authenticate('jwt', { session: false }) ,(req, res) => {
  const body = {
    id: req.user.id,
    email : req.user.email,
    username : req.user.username
  };
  return res.json({ body });
})

    



export default usersRoute;


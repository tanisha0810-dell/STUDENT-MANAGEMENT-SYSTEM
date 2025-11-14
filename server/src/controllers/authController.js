import user from '../models/User.js';
import {generateToken} from '../utils/jwt.js';

export const register = async(req, res) =>{
    try {
        const {name, email, password, role} = req.body;
        const userExists = await User.findOne({email});
        if (userExists) return res.json({message: "User exists already"});

        const user = await user.create({name, email, password, role});
        const token = generateToken(user);
        res.json({message: "Registered successfully", user, token});
        
    } catch (error){
        res.json({message: "Server error"});

    }
}


export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user || !(await user.matchPassword(password)))
            return res.json({message: "Invalid credentials"});
        const token = generateToken(user);
        res.json({message: "Successful login", user, token});
    } catch (error){
        res.json({message: "Server error"});
    }
}
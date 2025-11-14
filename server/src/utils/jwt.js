import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign({ id: user_id, role: user.role}, process.env.JWT_SECRET)
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};
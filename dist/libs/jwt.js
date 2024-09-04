import jwt from 'jsonwebtoken';
const JWT_SECRET = 'secret';
export default function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err)
                reject(err);
            resolve(token);
        });
    });
}
//# sourceMappingURL=jwt.js.map
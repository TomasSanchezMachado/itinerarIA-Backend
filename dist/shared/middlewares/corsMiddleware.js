import cors from 'cors';
const ACCEPTED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
];
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS, } = {}) => {
    const options = {
        origin: (origin, callback) => {
            if (origin && acceptedOrigins.includes(origin)) {
                return callback(null, true);
            }
            if (!origin) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
    };
    return cors(options);
};
//# sourceMappingURL=corsMiddleware.js.map
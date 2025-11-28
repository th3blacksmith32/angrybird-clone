import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static('.'));
app.use(routes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import router from './routes/web.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Running on port " + port);
});

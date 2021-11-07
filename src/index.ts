
import express from "express";
import {HealthRouter} from './routes/healthRouter';
import {VaccineRouter} from './routes/vaccineRouter';

import * as dotenv from "dotenv";
import {Router} from './routes/router';
import {VaccineController} from './controllers/vaccineController';
dotenv.config();

let port = 8888;
if (process.env.IN_CONTAINER) {
    port = 80;
}

const app = express();

app.use(express.json());

const router = new Router(app);
router.registerRoutes();

const healthRouter = new HealthRouter(app);

const vaccineController = new VaccineController();

app.get("/", (req, res) => {

    let ehrStoreUrl = process.env.EHRSTORE_LOCATION_URL;
    if (ehrStoreUrl == null) {
        ehrStoreUrl = "https://ehrstore.sandbox.dips.no";
    }

    res.send(`REMIN receiver v.1.0.0.7 is online!<br/>Configured EhrStore is: ${ehrStoreUrl}`);
});
app.get("/health", (req, res) => {healthRouter.doHealth(req, res)});
app.post("/vaccine", (req, res) => vaccineController.pushVaccine(req, res));


app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
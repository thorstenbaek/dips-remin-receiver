
import express from "express";
import {HealthRouter} from './routes/healthRouter';


import * as dotenv from "dotenv";
import {Router} from './routes/router';
import {VaccineController} from './controllers/vaccineController';
import {loadVaccines} from "./controllers/vaccineListController";
import {MasterPatientIndex} from './controllers/mpi';
import {generatePatientName} from './controllers/nameGenerator';
dotenv.config();

let port = 8888;
if (process.env.IN_CONTAINER) {
    port = 80;
}
let ehrStoreUrl = process.env.EHRSTORE_LOCATION_URL;
if (ehrStoreUrl == null) {
    ehrStoreUrl = "https://ehrstore.sandbox.dips.no";
}

const app = express();

app.use(express.json());

const router = new Router(app);
router.registerRoutes();

const masterPatientIndex = new MasterPatientIndex();

const healthRouter = new HealthRouter(app);
const vaccineController = new VaccineController(masterPatientIndex, ehrStoreUrl);


app.get("/", (req, res) => {
    res.send(`REMIN receiver v.1.0.0.10 is online!<br/>Configured EhrStore is: ${ehrStoreUrl}`);
});
app.get("/health", (req, res) => {healthRouter.doHealth(req, res)});
app.post("/vaccine", (req, res) => vaccineController.pushVaccine(req, res));

app.get("/ehr", (req, res) => {
    res.status(200).send(masterPatientIndex.allPatients());
})
app.get("/ehr/:id", (req, res) => {
    const pid = req.params.id;
    let p = masterPatientIndex.findPatient(pid);
    if (p == null) {
        console.log("Created a new patient");
        const names = generatePatientName();
        p = masterPatientIndex.add(pid, names[0], names[1], "unknown");

    }
    res.status(200).send(p);

})
app.get("/ehr/:id/vaccines", (req, res) => {
    const pid = req.params.id;
    const p = masterPatientIndex.findPatient(pid);
    if (p == null) {
        const names = generatePatientName();
        masterPatientIndex.add(pid, names[0], names[1], "unknown");

    }
    loadVaccines(masterPatientIndex, ehrStoreUrl, pid, req, res);


})


app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
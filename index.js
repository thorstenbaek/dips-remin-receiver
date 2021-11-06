import express from "express";
import HealthRouter from "./routes/healthRouter.js";
import VaccineRouter from "./routes/vaccineRouter.js";

var port = 8888;
if (process.env.IN_CONTAINER)
{
    port = 80;
}

const app = express();
app.use(express.json());

new HealthRouter(app);
new VaccineRouter(app);

app.get("/", (req, res) => {

    var ehrStoreUrl = process.env.EHRSTORE_LOCATION_URL;
    if (ehrStoreUrl == null) {
        ehrStoreUrl = "https://ehrstore.sandbox.dips.no";
    }    

    res.send(`REMIN receiver v.1.0.0.6 is online!<br/>Configured EhrStore is: ${ehrStoreUrl}`);
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
});
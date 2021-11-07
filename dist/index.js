"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const healthRouter_1 = require("./routes/healthRouter");
const dotenv = __importStar(require("dotenv"));
const router_1 = require("./routes/router");
const vaccineController_1 = require("./controllers/vaccineController");
dotenv.config();
let port = 8888;
if (process.env.IN_CONTAINER) {
    port = 80;
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
const router = new router_1.Router(app);
router.registerRoutes();
const healthRouter = new healthRouter_1.HealthRouter(app);
const vaccineController = new vaccineController_1.VaccineController();
app.get("/", (req, res) => {
    let ehrStoreUrl = process.env.EHRSTORE_LOCATION_URL;
    if (ehrStoreUrl == null) {
        ehrStoreUrl = "https://ehrstore.sandbox.dips.no";
    }
    res.send(`REMIN receiver v.1.0.0.7 is online!<br/>Configured EhrStore is: ${ehrStoreUrl}`);
});
app.get("/health", (req, res) => { healthRouter.doHealth(req, res); });
app.post("/vaccine", (req, res) => vaccineController.pushVaccine(req, res));
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map
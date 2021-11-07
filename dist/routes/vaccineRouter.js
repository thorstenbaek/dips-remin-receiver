"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineRouter = void 0;
const vaccineController_1 = require("../controllers/vaccineController");
const router_1 = require("./router");
class VaccineRouter extends router_1.Router {
    constructor(app) {
        super(app);
        this.controller = new vaccineController_1.VaccineController();
    }
    get root() {
        return "/vaccine";
    }
    setupRoutes(router) {
        router.post('/', (req, res) => this.controller.pushVaccine(req, res));
    }
}
exports.VaccineRouter = VaccineRouter;
//# sourceMappingURL=vaccineRouter.js.map
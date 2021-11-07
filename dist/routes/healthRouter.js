"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRouter = void 0;
const router_1 = require("./router");
class HealthRouter extends router_1.Router {
    get root() {
        return "/health";
    }
    doHealth(req, res) {
        const message = "Health check ok";
        console.log(message);
        res.status(200).send(message);
    }
    setupRoutes(router) {
        router.get("/", this.doHealth);
    }
}
exports.HealthRouter = HealthRouter;
//# sourceMappingURL=healthRouter.js.map
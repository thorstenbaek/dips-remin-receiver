import Router from "./router.js";
import VaccineController from "../controllers/vaccineController.js";

export default class VaccineRouter extends Router {
    constructor(app) {
        super(app);

        this.controller = new VaccineController();
    }
    
    get root() {
        return "/vaccine";        
    }
    
    setupRoutes(router) {                
        router.post('/', (req, res) => this.controller.pushVaccine(req, res));
    }
}
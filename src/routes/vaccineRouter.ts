
import {VaccineController} from '../controllers/vaccineController';
import * as express from "express";
import {Router} from './router';


export class VaccineRouter extends Router {
    private controller: VaccineController;
    constructor(app: express.Application) {
        super(app);

        this.controller = new VaccineController();
    }

    get root() {
        return "/vaccine";
    }

    setupRoutes(router: express.Router) {
        router.post('/', (req, res) => this.controller.pushVaccine(req, res));
    }
}
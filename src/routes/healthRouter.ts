
import * as express from "express";
import {Router} from './router';


export class HealthRouter extends Router {
    get root() {
        return "/health";
    }

    doHealth(req: express.Request, res: express.Response) {
        const message = "Health check ok";
        console.log(message);
        res.status(200).send(message);
    }

    setupRoutes(router: express.Router) {
        router.get("/", this.doHealth);
    }
}
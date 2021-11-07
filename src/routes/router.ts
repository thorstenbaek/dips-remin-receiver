import * as express from "express";

export class Router {
    private router: express.Router;
    constructor(private app: express.Application) {
        if (!app) {
            throw new Error("Missing router parameter");
        }
        this.app = app;
        this.router = express.Router();
        this.registerRoutes();
    }

    get root() {
        return "/";
    }

    setupRoutes(router: express.Router) {
        console.log("Setting up routers");
    }

    registerRoutes() {
        this.setupRoutes(this.router);
        this.app.use(this.root, this.router);
    }
}
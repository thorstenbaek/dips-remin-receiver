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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express = __importStar(require("express"));
class Router {
    constructor(app) {
        this.app = app;
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
    setupRoutes(router) {
        console.log("Setting up routers");
    }
    registerRoutes() {
        this.setupRoutes(this.router);
        this.app.use(this.root, this.router);
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map
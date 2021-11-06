import { buildComposition } from "./controllers/buildComposition.js";

var t = buildComposition(new Date(),"Vaksine","Astra Zdeneca","myBatch",1,"LEFT_ARM","Remin","En kommentar");
console.log(JSON.stringify(t,null,1));
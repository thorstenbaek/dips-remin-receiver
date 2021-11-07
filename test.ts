import {buildComposition} from './src/controllers/buildComposition';


var t = buildComposition(new Date(), "Vaksine", "Astra Zdeneca", "myBatch", 1, "LEFT_ARM", "Remin", "En kommentar", "Vaccinator");
console.log(JSON.stringify(t, null, 1));
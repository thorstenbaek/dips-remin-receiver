import {buildComposition} from './src/controllers/buildComposition';
import {generatePatientName} from './src/controllers/nameGenerator';

const names = generatePatientName();
console.log(names);

if (false) {
    var t = buildComposition(new Date(), "Vaksine", "Astra Zdeneca", "myBatch", 1, "LEFT_ARM", "Remin", "En kommentar", "Vaccinator");
    console.log(JSON.stringify(t, null, 1));
}
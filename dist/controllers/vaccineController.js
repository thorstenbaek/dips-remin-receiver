"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineController = void 0;
const buildComposition_1 = require("./buildComposition");
const buildContribution_1 = require("./buildContribution");
const node_fetch_1 = __importDefault(require("node-fetch"));
class VaccineController {
    constructor() {
        this.ehrStoreUrl = process.env.EHRSTORE_LOCATION_URL;
        if (this.ehrStoreUrl == null) {
            this.ehrStoreUrl = "https://ehrstore.sandbox.dips.no";
        }
    }
    createPatient(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createPatientArg = {
                subjectId: patientId,
                subjectNamespace: "remin",
                committerName: "remin-vaccination-app"
            };
            console.log(createPatientArg);
            const result = yield (0, node_fetch_1.default)(this.ehrStoreUrl + "/api/v1/ehr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(createPatientArg)
            });
            const ehrId = yield result.json();
            console.log(`Successfully created Ehr with id ${ehrId}`);
            return ehrId;
        });
    }
    checkForPatient(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkForPatientAql = `
            select
                e/ehr_id/value as EhrId
            from EHR e
            where
                -- comment out this - since the patientId might be present in another namespace, ie. given by DIPS or ehr_craft
                -- e/ehr_status/subject/external_ref/namespace = 'remin' and
                e/ehr_status/subject/external_ref/id/value = '${patientId}'`;
            console.log(checkForPatientAql);
            const response = yield (0, node_fetch_1.default)(this.ehrStoreUrl + "/api/v1/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    aql: checkForPatientAql,
                })
            });
            if (response.ok) {
                const resultSet = yield response.json();
                console.log(resultSet);
                if (resultSet.totalResults <= 0) {
                    console.log(`No EhrId found for patient ${patientId} - creating new ehrId`);
                    return yield this.createPatient(patientId);
                }
                else {
                    if (resultSet.rows) {
                        const ehrId = resultSet.rows[0][0];
                        console.log(`EhrId ${ehrId} was found for patient ${patientId}`);
                        return ehrId;
                    }
                    else {
                        console.log("No rows defined - return null");
                        return null;
                    }
                }
            }
            else {
                console.warn(`Where not able to find or create EHR for patient ${patientId}`);
                return null;
            }
        });
    }
    pushVaccine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const vaccineRegistration = req.body;
            console.log(vaccineRegistration);
            const ehrId = yield this.checkForPatient(vaccineRegistration.national_id);
            if (ehrId == null) {
                res.status(500).send("Error creating patient");
                return;
            }
            console.log(`creating composition for ehrId ${ehrId}`);
            // Convert data to composition
            if (vaccineRegistration.vaccine) {
                // There must be at least one vaccination - pick up the values and build the composition
                const patientId = vaccineRegistration.national_id;
                const when = vaccineRegistration.completed_at;
                const doseNumber = vaccineRegistration.vaccination_step ? vaccineRegistration.vaccination_step : 1;
                const placement = vaccineRegistration.placement ? vaccineRegistration.placement : "UNKNOWN";
                const organisation = vaccineRegistration.organization;
                const manufacturer = vaccineRegistration.vaccine.manufacturer;
                const vaccine = vaccineRegistration.vaccine.name;
                const notes = vaccineRegistration.notes ? vaccineRegistration.notes : "";
                const batchId = "UNKNOWN";
                const vaccinator = vaccineRegistration.given_by ? vaccineRegistration.given_by : "";
                const composition = (0, buildComposition_1.buildComposition)(when, vaccine, manufacturer, batchId, doseNumber, placement, organisation, notes, vaccinator);
                const result = yield this.contributeVaccineToEhrStore(composition, patientId, "REMIN", ehrId);
                if (result) {
                    res.status(200).send("OK");
                }
                else {
                    res.status(500).send("Error creating contribution");
                }
            }
            else {
                res.status(404).send("No vaccine registered");
            }
        });
    }
    contributeVaccineToEhrStore(composition, patientId, committer, ehrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contribution = (0, buildContribution_1.createContribution)(composition, committer, patientId);
            const path = `/api/v1/${ehrId}/contribution?committerName=${committer}`;
            // fs.writeFileSync("contribution.json",JSON.stringify(contribution,null,1),{ encoding: 'utf-8' });
            const result = yield (0, node_fetch_1.default)(this.ehrStoreUrl + path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(contribution)
            });
            const json = yield result.json();
            ;
            if (result.ok) {
                console.log("Posted contribution - result: " + JSON.stringify(json, null, 1));
                return true;
            }
            else {
                console.log("Error posting contribution: " + JSON.stringify(json, null, 1));
                return false;
            }
        });
    }
}
exports.VaccineController = VaccineController;
//# sourceMappingURL=vaccineController.js.map
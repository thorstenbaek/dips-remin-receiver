import fetch from "node-fetch";
import * as fs from 'fs';
import CompositionBuilder from "./compositionBuilder.js";
import { buildComposition } from "./buildComposition.js";
import { createContribution } from "./buildContribution.js";



export default class VaccineController {

    constructor() {
        this.ehrStoreUrl = process.env.EHRSTORE_LOCATION_URL;
        if (this.ehrStoreUrl == null) {
            this.ehrStoreUrl = "https://ehrstore.sandbox.dips.no";
        }

        this.compositionBuilder = new CompositionBuilder();
    }

    async createPatient(patientId) {
        const createPatientArg =
        {
            subjectId: patientId,
            subjectNamespace: "remin",
            committerName: "remin-vaccination-app"
        };

        console.log(createPatientArg);

        const result = await fetch(
            this.ehrStoreUrl + "/api/v1/ehr",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(createPatientArg)
            });

        const ehrId = await result.json();
        console.log(`Successfully created Ehr with id ${ehrId}`);
        return ehrId;
    }

    async checkForPatient(patientId) {
        const checkForPatientAql = `
            select
                e/ehr_id/value as EhrId
            from EHR e
            where 
                -- comment out this - since the patientId might be present in another namespace, ie. given by DIPS or ehr_craft
                -- e/ehr_status/subject/external_ref/namespace = 'remin' and 
                e/ehr_status/subject/external_ref/id/value = '${patientId}'`;
        console.log(checkForPatientAql);

        const result = await fetch(
            this.ehrStoreUrl + "/api/v1/query",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    aql: checkForPatientAql,
                })
            }
        );

        var patients = await result.json();
        if (patients.rows == null || patients.rows.length == 0) {
            console.log(`No EhrId found for patient ${patientId} - creating new ehrId`);
            return await this.createPatient(patientId);
        }
        else {
            var ehrId = patients.rows[0][0];
            console.log(`EhrId ${ehrId} was found for patient ${patientId}`);
            return ehrId;

        }
    }

    async pushVaccine(req,res) {
        var vaccineRegistration = req.body;
        console.log(vaccineRegistration);

        var ehrId = await this.checkForPatient(vaccineRegistration.national_id);

        if (ehrId == null) {
            res.status(500).send("Error creating patient");
            return;
        }

        console.log(`creating composition for ehrId ${ehrId}`);
        // Convert data to composition 

        if (vaccineRegistration.vaccine) {
            // There must be at least one vaccination - pick up the values and build the composition
            var patientId = vaccineRegistration.national_id;
            var when = vaccineRegistration.completed_at;
            var doseNumber = vaccineRegistration.vaccination_step ? vaccineRegistration.vaccination_step : 1;
            var placement = vaccineRegistration.placement ? vaccineRegistration.placement : "UNKNOWN";
            var organisation = vaccineRegistration.organization;
            var manufacturer = vaccineRegistration.vaccine.manufacturer;
            var vaccine = vaccineRegistration.vaccine.name;
            var notes = vaccineRegistration.notes ? vaccineRegistration.notes : "";
            var batchId = "UNKNOWN";
            var vaccinator = vaccineRegistration.given_by ? vaccineRegistration.given_by : "";
            var composition = buildComposition(when,vaccine,manufacturer,batchId,doseNumber,placement,organisation,notes,vaccinator);


            const result = await this.contributeVaccineToEhrStore(composition,patientId,"REMIN",ehrId);
            if (result) {
                res.status(200).send("OK");
            } else {
                res.status(500).send("Error creating contribution");
            }

        } else {
            res.status(404).send("No vaccine registered");
        }

    }

    async contributeVaccineToEhrStore(composition,patientId,committer,ehrId) {
        var contribution = createContribution(composition,committer,patientId);
        var path = `/api/v1/${ehrId}/contribution?committerName=${committer}`;

        //fs.writeFileSync("contribution.json",JSON.stringify(contribution,null,1),{ encoding: 'utf-8' });

        const result = await fetch(
            this.ehrStoreUrl + path,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(contribution)
            }
        );
        var json = await result.json(result);
        if (result.ok) {
            console.log("Posted contribution - result: " + JSON.stringify(json,null,1));
            return true;
        } else {
            console.log("Error posting contribution: " + JSON.stringify(json,null,1));
            return false;
        }


    }
}
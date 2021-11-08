
import {buildComposition} from "./buildComposition";
import {createContribution} from "./buildContribution";
import * as express from "express";
import fetch from 'node-fetch';
import {ResultSet} from "../model/ResultSet";
import {MasterPatientIndex} from './mpi';
import {generatePatientName} from './nameGenerator';







export class VaccineController {


    constructor(private masterPatientIndex: MasterPatientIndex, private ehrStoreUrl: string) {


    }

    async createPatient(patientId: string): Promise<string> {
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

        const ehrId = await result.json() as string;
        console.log(`Successfully created Ehr with id ${ehrId}`);
        return ehrId;
    }

    async checkForPatient(patientId: string): Promise<string | null> {
        const checkForPatientAql = `
            select
                e/ehr_id/value as EhrId
            from EHR e
            where
                -- comment out this - since the patientId might be present in another namespace, ie. given by DIPS or ehr_craft
                -- e/ehr_status/subject/external_ref/namespace = 'remin' and
                e/ehr_status/subject/external_ref/id/value = '${patientId}'`;
        console.log(checkForPatientAql);

        const response = await fetch(
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
        if (response.ok) {
            const resultSet = await response.json() as ResultSet;
            console.log(resultSet);
            if (resultSet.totalResults <= 0) {
                console.log(`No EhrId found for patient ${patientId} - creating new ehrId`);
                const names = generatePatientName();
                this.masterPatientIndex.add(patientId, names[0], names[1], 'unknown');
                return await this.createPatient(patientId);
            } else {

                if (resultSet.rows) {
                    const ehrId = resultSet.rows[0][0];
                    console.log(`EhrId ${ehrId} was found for patient ${patientId}`);
                    return ehrId;
                } else {
                    console.log("No rows defined - return null");
                    return null;
                }

            }
        } else {
            console.warn(`Where not able to find or create EHR for patient ${patientId}`);
            return null;
        }
    }

    async pushVaccine(req: express.Request, res: express.Response) {
        const vaccineRegistration = req.body;
        console.log(vaccineRegistration);

        const ehrId = await this.checkForPatient(vaccineRegistration.national_id);

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
            const batchId = vaccineRegistration.vaccine.batch_id ? vaccineRegistration.vaccine.batch_id : "";
            const vaccinator = vaccineRegistration.given_by ? vaccineRegistration.given_by : "";

            console.log("batchId", batchId);

            const composition = buildComposition(when, vaccine, manufacturer, batchId, doseNumber, placement, organisation, notes, vaccinator);


            const result = await this.contributeVaccineToEhrStore(composition, patientId, "REMIN", ehrId);
            if (result) {
                res.status(200).send("OK");
            } else {
                res.status(500).send("Error creating contribution");
            }

        } else {
            res.status(404).send("No vaccine registered");
        }

    }

    async contributeVaccineToEhrStore(composition: any, patientId: string, committer: string, ehrId: string): Promise<boolean> {
        const contribution = createContribution(composition, committer, patientId);
        const path = `/api/v1/${ehrId}/contribution?committerName=${committer}`;

        // fs.writeFileSync("contribution.json",JSON.stringify(contribution,null,1),{ encoding: 'utf-8' });

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
        const json = await result.json();;
        if (result.ok) {
            console.log("Posted contribution - result: " + JSON.stringify(json, null, 1));
            return true;
        } else {
            console.log("Error posting contribution: " + JSON.stringify(json, null, 1));
            return false;
        }


    }
}
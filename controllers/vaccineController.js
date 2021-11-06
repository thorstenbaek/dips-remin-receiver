import fetch from "node-fetch";
import CompositionBuilder from "./compositionBuilder.js";

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
                e/ehr_status/subject/external_ref/namespace = 'remin' and 
                e/ehr_status/subject/external_ref/id/value = '${patientId}'`;                        

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

        const patients = await result.json()
        if (patients?.rows == null) {
            console.log(`No EhrId found for patient ${patientId} - creating new ehrId`);
            return await this.createPatient(patientId);
        }
        else 
        {
            var ehrId = patients.rows[0][0];
            console.log(`EhrId ${ehrId} was found for patient ${patientId}`);            
            return ehrId;
        }
    }

    async pushVaccine(req, res) {
        var vaccineRegistration = req.body;
        console.log(vaccineRegistration);

        var ehrId = await this.checkForPatient(vaccineRegistration.national_id);

        if(ehrId == null) {
            res.status(500).send("Error creating patient");
            return;
        }

        console.log(`creating composition for ehrId ${ehrId}`);
        // Convert data to composition 
        var composition = this.compositionBuilder.build(vaccineRegistration);
        
        //Push composition to EHRStore        
        const result = await fetch(
            this.ehrStoreUrl + "/api/v1/" + ehrId + "/composition/?committerName=REMIN&versionLifecycleState=532",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: composition
            }
        );
        const json = await result.json(result)
        console.log("Successfully created compositon " + json);                
        res.status(200).send("OK");
    }    
}
import * as express from 'express';
import fetch from 'node-fetch';
import {QueryBuilder} from '../model/QueryBuilder';
import {ResultSet} from '../model/ResultSet';
import {MasterPatientIndex, Patient} from './mpi';
export async function loadVaccines(mpi: MasterPatientIndex, ehrStoreUrl: string, patientId: string, req: express.Request, res: express.Response) {
    console.log("loading vaccines from EHR Store " + ehrStoreUrl);
    let patient: Patient | null = mpi.findPatient(patientId);
    if (patient == null) {
        console.log("Patient is not known - createone");
        patient = mpi.add(patientId, "Generated", "Generated", "mann");
    }
    const t = new QueryBuilder(getAql());
    t.addTag("PatientId", patientId);
    const query = t.build();
    const response = await fetch(
        ehrStoreUrl + "/api/v1/query",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(query)
        }
    );
    if (response.ok) {
        const resultSet = await response.json() as ResultSet;
        if (resultSet.totalResults > 0) {
            const vaccines = resultSet.rows ? resultSet.rows : [];
            const out = {
                "patient": patient,
                "numberOfVaccines": resultSet.totalResults,
                "result": vaccines
            }
            res.status(200).send(out);
        } else {
            const out = {
                "patient": patient,
                "numberOfVaccines": 0
            }
            res.status(200).send(out);
        }

    } else {
        console.error("Error running query");
        console.error(response.status);
        console.error(response.body);
        res.status(500).send(query);
    }



}

function getAql(): string {
    return `select
   tag(c,'PatientId') as PID,
   c/uid/value as CID,
   a/description[at0017]/items[at0020]/value/value as Vaccine,
   a/description[at0017]/items[openEHR-EHR-CLUSTER.medication.v1]/items[at0151]/value/value as Manufacturer,
   a/description[at0017]/items[openEHR-EHR-CLUSTER.medication.v1]/items[at0150]/value/value as BatchId,
   a/description[at0017]/items[at0025]/value/magnitude as DoseNumber,
   a/description[at0017]/items[at0140]/items[at0141]/value/value as Placement,
   a/protocol[at0030]/items[openEHR-EHR-CLUSTER.organisation.v0]/items[at0001]/value/value as Organisation,
   a/description[at0017]/items[openEHR-EHR-CLUSTER.person.v0]/items[at0001]/value/value as Vaccinator,
   a/description[at0017]/items[at0024]/value/value as Notes,
   a/time/value as Time
from
   composition c
      contains ACTION a[openEHR-EHR-ACTION.medication.v1]
where
   a/description[at0017]/items[at0156]/value/defining_code/terminology_id/value = 'SNOMED-CT' and
   a/description[at0017]/items[at0156]/value/defining_code/code_string = '33879002'

order by a/time/value desc`;
}
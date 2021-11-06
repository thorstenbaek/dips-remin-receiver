/**
 * 
 * @param {string} composition 
 * @param {string} committerName 
 * @param {string} patientId 
 * @returns {string}
 */
export function createContribution(composition,committerName,patientId) {
    var now = new Date();
    var nowIso = now.toISOString();
    var c = {
        "_type": "CONTRIBUTION_REQUEST",
        "versions": [
            {
                "context": [
                    {
                        "key": "PatientId",
                        "value": patientId
                    }
                ],
                "data": composition,
                "lifecycle_state": 532,
            }
        ],
        "uid": null,
        "audit": {
            "_type": "AUDIT_DETAILS",
            "system_id": "REMIN",
            "time_committed": {
                "_type": "DV_DATE_TIME",
                "value": nowIso
            },
            "change_type": {
                "_type": "DV_CODED_TEXT",
                "value": "creation",
                "defining_code": {
                    "_type": "CODE_PHRASE",
                    "terminology_id": {
                        "_type": "TERMINOLOGY_ID",
                        "value": "openehr"
                    },
                    "code_string": "249"
                }
            },
            "committer": {
                "_type": "PARTY_IDENTIFIED",
                "external_ref": {
                    "_type": "PARTY_REF",
                    "namespace": "demographic",
                    "type": "PERSON",
                    "id": {
                        "_type": "GENERIC_ID"
                    }
                },
                "name": committerName
            }
        }

    };
    return JSON.stringify(c);
}
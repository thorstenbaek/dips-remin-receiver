/**
 * 
 * @param {string} composition 
 * @param {string} committerName 
 * @param {string} patientId 
 * @returns {any}
 */
export function createContribution(composition,committerName,patientId) {

    var now = new Date();
    var nowIso = now.toISOString();
    var c = [
        {
            "content": composition,
            "preceding_version_uid": null,
            "lifecycle_state": 532,
            tags: [
                {
                    key: 'PatientId',
                    value: patientId
                }
            ]

        }
    ];

    return c;
}

/**
 * 
 * @param {string} composition 
 * @param {string} committerName 
 * @param {string} patientId 
 * @returns {any}
 */
export function createContributionOld(composition,committerName,patientId) {

    var now = new Date();
    var nowIso = now.toISOString();
    var c = {
        "audit": {
            "_type": "AUDIT_DETAILS",
            "system_id": "ehr_craft",
            "committer": {
                "_type": "PARTY_IDENTIFIED",
                "external_ref": {
                    "id": {
                        "_type": "GENERIC_ID",
                        "value": ""
                    },
                    "namespace": "demographic",
                    "type": "PERSON"
                },
                "name": committerName
            },
            "time_committed": {
                "value": nowIso
            },
            "change_type": {
                "value": "creation",
                "defining_code": {
                    "terminology_id": {
                        "value": "openehr"
                    },
                    "code_string": "249"
                }
            }
        },
        "versions": [
            {
                "data": composition,
                //      "preceding_version_uid": null,
                "lifecycle_state": 532,
                "context": [
                    {
                        "key": "PatientId",
                        "value": patientId
                    }
                ]
            }
        ]
    };
    return c;
}
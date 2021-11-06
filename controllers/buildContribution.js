/**
 * 
 * @param {string} composition 
 * @param {string} committerName 
 * @param {string} patientId 
 * @returns {any}
 */
export function createContribution(composition,committerName,patientId) {
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
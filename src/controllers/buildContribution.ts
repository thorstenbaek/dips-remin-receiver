/**
 *
 * @param {string} composition
 * @param {string} committerName
 * @param {string} patientId
 * @returns {any}
 */
export function createContribution(composition: any, committerName: string, patientId: string) {
    const precedingVersion: string | null = null;
    return [
        {
            "content": composition,
            "preceding_version_uid": precedingVersion,
            "lifecycle_state": 532,
            tags: [
                {
                    key: 'PatientId',
                    value: patientId
                }
            ]

        }
    ];


}
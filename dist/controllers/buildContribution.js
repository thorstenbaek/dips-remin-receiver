"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContribution = void 0;
/**
 *
 * @param {string} composition
 * @param {string} committerName
 * @param {string} patientId
 * @returns {any}
 */
function createContribution(composition, committerName, patientId) {
    const precedingVersion = null;
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
exports.createContribution = createContribution;
//# sourceMappingURL=buildContribution.js.map
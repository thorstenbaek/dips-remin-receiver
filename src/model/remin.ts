export interface Remin {
    allergicReaction?: boolean;
    clearedBy?: ClearedByEnum;
    completedAt: Date;
    givenBy?: string;
    nationalID: string;
    notes?: string;
    organization: string;
    parentalConsentGiven?: boolean;
    parentalConsentGivenAt?: Date;
    placement?: PlacementEnum;
    selfDeclaration?: ReminSelfDeclaration[];
    vaccinationStep?: number;
    vaccine: ReminVaccine;
    validIdentification?: boolean;
}

/**
 * An enumeration.
 */
export enum ClearedByEnum {
    CommonPractitioner = "COMMON_PRACTITIONER",
    NotCleared = "NOT_CLEARED",
    OtherDoctor = "OTHER_DOCTOR",
    Patient = "PATIENT",
}

/**
 * An enumeration.
 */
export enum PlacementEnum {
    LeftArm = "LEFT_ARM",
    LeftLeg = "LEFT_LEG",
    Other = "OTHER",
    RightArm = "RIGHT_ARM",
    RightLeg = "RIGHT_LEG",
}

export interface ReminSelfDeclaration {
    answer: boolean;
    notes?: string;
    question: string;
}

export interface ReminVaccine {
    manufacturer: string;
    name: string;
}

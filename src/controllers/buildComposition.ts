

/**
 *
 * @param placement
 * @returns
 */
function placementToHumanReadableString(placement: string) {
    switch (placement) {
        case "LEFT_ARM":
            return "Venstre arm";
        case "RIGHT_ARM":
            return "Høyre arm";
        case "LEFT_LEG":
            return "Venstre bein";
        case "RIGHT_LEG":
            return "Høyre bein";
        case "OTHER":
            return "Annet sted";
        default:
            return "Ukjent";
    }
}
/**
 *
 * @param when
 */
function timeToIsoTime(when: Date): string {
    return when.toISOString();

}
/**
 *
 * @param when
 * @param vaccine
 * @param manufacturer
 * @param batchId
 * @param doseNumber
 * @param placement
 * @param organisation
 * @param comment
 * @param vaccinator
 * @returns
 */
export function buildComposition(when: Date, vaccine: string, manufacturer: string, batchId: string, doseNumber: number, placement: string, organisation: string, comment: string, vaccinator: string) {
    const anatomicalLocation = placementToHumanReadableString(placement);
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const vaccineTime = new Date(when);
    if (when) {
        vaccineTime.setHours(hour);
        vaccineTime.setMinutes(minutes);

    }
    const time = timeToIsoTime(vaccineTime);

    const composition = {
        "_type": "COMPOSITION",
        "archetype_node_id": "openEHR-EHR-COMPOSITION.vaccination_list.v0",
        "name": {
            "value": "Vaksinasjonsliste"
        },

        "archetype_details": {
            "archetype_id": {
                "value": "openEHR-EHR-COMPOSITION.vaccination_list.v0"
            },
            "template_id": {
                "value": "vaccination_list_v10"
            },
            "rm_version": "1.0.4"
        },
        "language": {
            "terminology_id": {
                "value": "openehr"
            },
            "code_string": "nb"
        },
        "territory": {
            "terminology_id": {
                "value": "openehr"
            },
            "code_string": "NO"
        },
        "category": {
            "defining_code": {
                "terminology_id": {
                    "value": "openehr"
                },
                "code_string": "433"
            }
        },
        "composer": {
            "_type": "PARTY_IDENTIFIED",
            "name": "default"
        },
        "context": {
            "start_time": {
                "value": time
            },
            "end_time": {
                "value": time
            },
            "setting": {
                "value": "secondary medical care",
                "defining_code": {
                    "terminology_id": {
                        "value": "openehr"
                    },
                    "code_string": "232"
                }
            },
            "other_context": {
                "_type": "ITEM_TREE",
                "archetype_node_id": "at0004",
                "name": {
                    "value": "Tree"
                }
            }
        },
        "content": [{
            "_type": "ACTION",
            "archetype_node_id": "openEHR-EHR-ACTION.medication.v1",
            "name": {
                "value": "Vaksinering#1"
            },
            "archetype_details": {
                "archetype_id": {
                    "value": "openEHR-EHR-ACTION.medication.v1"
                },
                "template_id": {
                    "value": "vaccination_list_v10"
                },
                "rm_version": "1.0.4"
            },
            "language": {
                "terminology_id": {
                    "value": "ISO_639-1"
                },
                "code_string": "nb"
            },
            "encoding": {
                "terminology_id": {
                    "value": "IANA"
                },
                "code_string": "UTF-8"
            },
            "subject": {
                "_type": "PARTY_SELF"
            },
            "protocol": {
                "_type": "ITEM_TREE",
                "archetype_node_id": "at0030",
                "name": {
                    "value": "Tree"
                },
                "items": [{
                    "_type": "CLUSTER",
                    "archetype_node_id": "openEHR-EHR-CLUSTER.organisation.v0",
                    "name": {
                        "value": "Organisasjon"
                    },
                    "archetype_details": {
                        "archetype_id": {
                            "value": "openEHR-EHR-CLUSTER.organisation.v0"
                        },
                        "template_id": {
                            "value": "vaccination_list_v10"
                        },
                        "rm_version": "1.0.4"
                    },
                    "items": [{
                        "_type": "ELEMENT",
                        "archetype_node_id": "at0001",
                        "name": {
                            "value": "Navn"
                        },
                        "value": {
                            "_type": "DV_TEXT",
                            "value": organisation
                        }
                    }]
                }]
            },
            "time": {
                "value": time
            },
            "description": {
                "_type": "ITEM_TREE",
                "archetype_node_id": "at0017",
                "name": {
                    "value": "Tree"
                },
                "items": [{
                    "_type": "ELEMENT",
                    "archetype_node_id": "at0025",
                    "name": {
                        "value": "Dosenummer"
                    },
                    "value": {
                        "_type": "DV_COUNT",
                        "magnitude": doseNumber
                    }
                },
                {
                    "_type": "CLUSTER",
                    "archetype_node_id": "openEHR-EHR-CLUSTER.person.v0",
                    "name": {
                        "value": "Vaksinatør"
                    },
                    "archetype_details": {
                        "archetype_id": {
                            "value": "openEHR-EHR-CLUSTER.person.v0"
                        },
                        "template_id": {
                            "value": "vaccination_list_v10"
                        },
                        "rm_version": "1.0.4"
                    },
                    "items": [
                        {
                            "_type": "ELEMENT",
                            "archetype_node_id": "at0001",
                            "name": {
                                "value": "Vaksinatør"
                            },
                            "value": {
                                "_type": "DV_TEXT",
                                "value": vaccinator
                            }
                        },
                        {
                            "_type": "ELEMENT",
                            "archetype_node_id": "at0004",
                            "name": {
                                "value": "Rolle"
                            },
                            "value": {
                                "_type": "DV_CODED_TEXT",
                                "value": "Vaksinatør",
                                "defining_code": {
                                    "terminology_id": {
                                        "value": "local_terms"
                                    },
                                    "code_string": "VACCINATOR"
                                }
                            }
                        }
                    ]
                },
                {
                    "_type": "ELEMENT",
                    "archetype_node_id": "at0020",
                    "name": {
                        "value": "Legemiddel"
                    },
                    "value": {
                        "_type": "DV_TEXT",
                        "value": vaccine
                    }
                },
                {
                    "_type": "CLUSTER",
                    "archetype_node_id": "openEHR-EHR-CLUSTER.medication.v1",
                    "name": {
                        "value": "Legemiddel"
                    },
                    "archetype_details": {
                        "archetype_id": {
                            "value": "openEHR-EHR-CLUSTER.medication.v1"
                        },
                        "template_id": {
                            "value": "vaccination_list_v10"
                        },
                        "rm_version": "1.0.4"
                    },
                    "items": [{
                        "_type": "ELEMENT",
                        "archetype_node_id": "at0132",
                        "name": {
                            "value": "Navn"
                        },
                        "value": {
                            "_type": "DV_TEXT",
                            "value": vaccine
                        }
                    },
                    {
                        "_type": "ELEMENT",
                        "archetype_node_id": "at0151",
                        "name": {
                            "value": "Produsent"
                        },
                        "value": {
                            "_type": "DV_TEXT",
                            "value": manufacturer
                        }
                    },
                    {
                        "_type": "ELEMENT",
                        "archetype_node_id": "at0150",
                        "name": {
                            "value": "Batch-ID"
                        },
                        "value": {
                            "_type": "DV_TEXT",
                            "value": batchId
                        }
                    }
                    ]
                },
                {
                    "_type": "CLUSTER",
                    "archetype_node_id": "at0140",
                    "name": {
                        "value": "Administreringsdetaljer"
                    },
                    "items": [{
                        "_type": "ELEMENT",
                        "archetype_node_id": "at0141",
                        "name": {
                            "value": "Anatomisk lokalisering"
                        },
                        "value": {
                            "_type": "DV_TEXT",
                            "value": anatomicalLocation
                        }
                    }]
                },
                {
                    "_type": "ELEMENT",
                    "archetype_node_id": "at0156",
                    "name": {
                        "value": "Klinisk indikasjon"
                    },
                    "value": {
                        "_type": "DV_CODED_TEXT",
                        "value": "Immunisation",
                        "defining_code": {
                            "terminology_id": {
                                "value": "SNOMED-CT"
                            },
                            "code_string": "33879002"
                        }
                    }
                },
                {
                    "_type": "ELEMENT",
                    "archetype_node_id": "at0024",
                    "name": {
                        "value": "Kommentar"
                    },
                    "value": {
                        "_type": "DV_TEXT",
                        "value": "".concat(comment)
                    }
                }
                ]
            },
            "ism_transition": {
                "current_state": {
                    "value": "completed",
                    "defining_code": {
                        "terminology_id": {
                            "value": "openehr"
                        },
                        "code_string": "532"
                    }
                },
                "careflow_step": {
                    "value": "Medisinering fullført",
                    "defining_code": {
                        "terminology_id": {
                            "value": "local"
                        },
                        "code_string": "at0007"
                    }
                }
            }
        }]
    };
    return composition;
}
export default class CompositionBuilder {

    build(vaccination) {
        var composition = `
        {
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
           "value": "${vaccination.completed_at}"
               },
           "end_time": {
           "value": "${vaccination.completed_at}"
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
           "content": [
               {
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
           "time": {
           "value": "${vaccination.completed_at}"
                 },
           "description": {
           "_type": "ITEM_TREE",
           "archetype_node_id": "at0017",
           "name": {
           "value": "Tree"
                   },
           "items": [
                     {
           "_type": "ELEMENT",
           "archetype_node_id": "at0020",
           "name": {
           "value": "Legemiddel"
                       },
           "value": {
           "_type": "DV_TEXT",
           "value": "${vaccination.vaccine?.manufacturer}, ${vaccination.vaccine?.name}"
                       }
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
           "value": "En kommentar"
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
               }
             ]
            }`;

        return composition;
    }
}
    
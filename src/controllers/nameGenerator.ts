import {uniqueNamesGenerator, Config, names, starWars} from 'unique-names-generator';

const config: Config = {
    dictionaries: [names, starWars]
}

export function generatePatientName() {
    const firstName = uniqueNamesGenerator(config);

    return firstName.split("_");
}
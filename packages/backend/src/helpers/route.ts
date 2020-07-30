import {getRoutes} from "@truecost/shared";

const {frontend, backend, environment, domain} = getRoutes(process.env.NODE_ENV);

export {frontend, backend, environment, domain}
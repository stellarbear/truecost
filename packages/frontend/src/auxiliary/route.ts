import {getRoutes} from "@truecost/shared";

const {frontend, backend, environment} = getRoutes(process.env.RAZZLE_APP_ENV);

export {frontend, backend, environment};
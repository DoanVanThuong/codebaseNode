export enum ENV_NAME {
    PRODUCTION,
    STAGING,
    DEVELOPMENT
}

export let name: ENV_NAME;
export let port: number;
export let host: string;
export let elastic_log_index: string;
export let host_realtime: string;
export let host_osrm: string;

export let host_kong_admin: string;
export let host_redirect: string;

export let host_onesignal: string;
export let onesignal_shipper_id: string;

export function configure(env: string) {
    this.port = 3836;
    console.log(`Enviroment: ${env}`)
    env = env.toLowerCase();
    {
        if (env == 'stag' || env == 'stagging') {
            this.name = ENV_NAME.STAGING;
            console.log("server was running in Stag Env");

            // elastic_log_index = 'mm_dev';
            // host = 'http://stag.mm.api.mpex.vn:8000';
            // host_realtime = 'http://localhost:3254';
            // host_osrm = 'http://osrm.mpex.vn:8000';
            // host_kong_admin = 'http://localhost:8001';
            // host_redirect = 'http://api.mpex.vn';
            // host_onesignal = 'https://onesignal.com/api/v1';
            // onesignal_shipper_id = 'feafc095-f01d-4157-9267-fd6d2369e761';
        }
        else if (env == 'prod' || env == 'production') {
            this.name = ENV_NAME.PRODUCTION;
            console.log("server was running in pro Env");
        }
        else {
            this.name = ENV_NAME.DEVELOPMENT;
            console.log("server was running in dev Env");
        }

    }
}
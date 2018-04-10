
import * as request from 'request-promise';
import * as ENV from '../glob/env';
import { HC } from '../glob/hc';

export function callAPI_RealTime(method: string, uri: string, body: any) {
    const headers = {
        'apikey': HC.APIKEY_REALTIME,
        'Content-Type': 'application/json'
    };
    return request(`${ENV.host_realtime}${uri}`, {
        method: method,
        body: body,
        headers: headers,
        json: true
    });
}

export function callAPI_OSRM(method: string, uri: string, body: any) {
    const headers = {
        'Content-Type': 'application/json'
    };
    return request(`${ENV.host_osrm}${uri}`, {
        method: method,
        body: body,
        headers: headers,
        json: true
    });
}

export function callAPI_OneSignal(method: string, uri: string, body: any) {
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${HC.APIKEY_ONESIGNAL}`
    };
    return request(`${ENV.host_onesignal}${uri}`, {
        method: method,
        body: body,
        headers: headers,
        json: true
    });
}
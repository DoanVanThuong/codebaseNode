import { callAPI_OSRM } from "../utils/call-requested";

export class OSRM {
    static async getDistance(fromLng: number, fromLat: number, toLng: number, toLat: number): Promise<number> {
        const result = await callAPI_OSRM('GET', `/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}`, null);
        return Math.ceil(result.routes[0].distance / 1000) || 0;
    }
}

export default OSRM;
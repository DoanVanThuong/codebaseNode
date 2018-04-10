import { callAPI_RealTime } from "../utils/call-requested";


export interface IRealTimeEvent {
    event: string;
    room: string;
    args: any;
}

export class RealTime {
    static mkEvent(room: string, event: string, args: any): IRealTimeEvent {
        return {
            event: event,
            room: room,
            args: args
        }
    }

    static async pushEvents(events: IRealTimeEvent[]) {
        return callAPI_RealTime('POST', `/events`, { events: events });
    }

    static pushEvent(room: string, event: string, args: any) {
        return this.pushEvents([this.mkEvent(room, event, args)]);
    }

    static async subscribeRoom(room: string, clientId: string) {
        return callAPI_RealTime('POST', `/rooms/${room}/clients/${clientId}`, {});
    }
}

export default RealTime;
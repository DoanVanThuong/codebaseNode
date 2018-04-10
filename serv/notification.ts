import _ from 'utils-nodejs';
import { HC } from "../glob/hc";
import { callAPI_OneSignal } from "../utils/call-requested";
import { onesignal_shipper_id } from "../glob/env";
import { PushNotification } from "../models/pushNotification";
import { User } from "../models/user";
import { ALL_USER_TYPE } from "../glob/cf";


interface IMessageWithPlayer {
    app_id: string;
    contents: any;
    include_player_ids: string[];
}

export class NotificationServ {
    static async sendNotificationForShipper(message: Object, userIds: string[]) {
        const players: PushNotification[] = await PushNotification.findAll<PushNotification>({ where: { user: userIds } }) || [];
        if (_.isEmpty(players)) {
            return;
        }

        const body: IMessageWithPlayer = {
            app_id: onesignal_shipper_id,
            contents: message,
            include_player_ids: (players || []).map(p => p.player_id)
        }
        const data = await callAPI_OneSignal('POST', `/notifications`, body);
    }
}

export default NotificationServ;
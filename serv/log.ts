// Import libraries
import * as moment from 'moment';
import * as elasticsearch from 'elasticsearch';

// Import utils
import HC from '../glob/hc';
import * as ENV from '../glob/env';
import { ELASTIC } from '../glob/conn';
import _ from 'utils-nodejs';
import ERR from '../glob/err';

// Import models
import { User } from '../models/user'

type ACTION = 'LAY_DANH_SACH_VI_TRI_MPERS';

export class LogServ {
    _client: elasticsearch.Client;

    constructor(client: elasticsearch.Client) {
        this._client = client;
    }

    private writeLog(indexName: string, typeIndex: string, body: any) {
        return this._client.index({
            index: indexName,
            type: typeIndex,
            body: body
        });
    }

    async logAction(uid: number, action: ACTION, target: { id: string, name: string }, params: Object) {
        const user = await User.find<User>({ where: { id: uid }, attributes: ['id', 'first_name', 'last_name'] });
        if (_.isEmpty(user)) {
            throw _.logicError('User not exist', `Could not find user with id ${uid}`, 400, ERR.OBJECT_NOT_FOUND, uid);
        }
        const body = {
            actor: {
                id: user.id,
                name: `${user.full_name}`,
            },
            action: action,
            target: target,
            params: params,
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        this.writeLog(ENV.elastic_log_index, 'action', body);
    }

    async logOpenAPI(actor: string, uri: string, target: { id: string, name: string }, params: Object) {
        const body = {
            actor: actor,
            uri: uri,
            target: target,
            params: params,
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        this.writeLog(ENV.elastic_log_index, 'openAPI', body);
    }

    closeConnection() {
        // close connection
    }
}

export let LOG: LogServ;
export function init() {
    LOG = new LogServ(ELASTIC);
}
export default LOG;
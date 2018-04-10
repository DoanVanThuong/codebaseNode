// Import libraries here
import * as express from 'express';
import * as moment from 'moment';
import * as uuid from 'uuid';

// Import utils
import HC from '../glob/hc';
import ERR from '../glob/err';
import _ from 'utils-nodejs'
import ajv2 from 'ajv2'
import { ALL_USER_TYPE } from '../glob/cf';

// Import models here

// Import services here
import { AuthServ } from '../serv/auth';
import { GenServ } from '../serv/genCode';
import { RealTime } from '../serv/realtime';
import { LOG } from '../serv/log';
import { User } from '../models/user';

const router = express.Router();
const _ajv = ajv2();


const subcribeMperBody = _ajv({
    '+@client_id': 'string|>0'
});
// TODO
router.post('/shipper', _.validBody(subcribeMperBody), AuthServ.authType(ALL_USER_TYPE.SHIPPER), _.routeAsync(async (req) => {
    const shipper: User = req.session.user;
    const clientId: string = req.body.client_id;
    RealTime.subscribeRoom(`MM:SHIPPER:${shipper.id}:TRIP`, clientId);

    return HC.SUCCESS;
}));

// const subcribeMpersBody = _ajv({
//     '+@client_id': 'string|>0'
// });
// // TODO
// router.post('/mpers/:listIds', _.validBody(subcribeMpersBody), AuthServ.authType(ALL_USER_TYPE.MPER, ALL_USER_TYPE.MPEX, ALL_USER_TYPE.MONITOR), _.routeAsync(async (req) => {
//     const listIds: number[] = _.split(req.params.listIds, ",").map(id => parseInt(id));
//     const clientId: string = req.body.client_id;
//     listIds.map(id => {
//         RealTime.subscribeRoom(`MPER:${id}`, clientId);
//     });

//     LOG.logActions(listIds.map(id => LOG.mkAction(req.session.user, 'SUBCRIBE_ROOM', `MPER:${id}`, null, { type: 'MPER', id: id, clientId: clientId })));

//     return HC.SUCCESS;
// }));

// const subcribeMonitorBody = _ajv({
//     '+@client_id': 'string|>0'
// });
// // TODO
// router.post('/monitor', _.validBody(subcribeMonitorBody), AuthServ.authType(ALL_USER_TYPE.MONITOR), _.routeAsync(async (req) => {
//     const clientId: string = req.body.client_id;
//     RealTime.subscribeRoom(`MONITOR`, clientId);

//     LOG.logAction(req.session.user, 'SUBCRIBE_ROOM', `MONITOR`, null, { type: 'MONITOR', clientId: clientId });

//     return HC.SUCCESS;
// }));

export default router;
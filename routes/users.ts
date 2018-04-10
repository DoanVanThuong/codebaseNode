import { Request, Response, Router } from "express";
import ajv2 from 'ajv2'
import _ from 'utils-nodejs'
import Shipper from '../models/shipper';
import User from '../models/user';
import { ERR } from "../glob/err";
import { HC } from "../glob/hc";
import { ALL_USER_TYPE_ARR, ALL_USER_TYPE, ALL_SHIPPER_STATUS, USER_TYPE } from "../glob/cf";
import { SEQUELIZE } from '../glob/conn';
import * as moment from 'moment';
import { AuthServ } from "../serv/auth";
import { PushNotification } from "../models/pushNotification";

const router = Router();

const _ajv = ajv2();
const createUser = _ajv({
    '+@full_name': 'string|>0',
    '+@phone': 'string|>0',
    '+type': { enum: ALL_USER_TYPE_ARR },
    '@blocked': 'boolean',
    '++': false
});

router.post('/', _.validBody(createUser), _.routeAsync(async (req, res, next) => {
    if (req.body.type !== ALL_USER_TYPE.SHIPPER) {
        const user: User = await User.create<User>({
            ...req.body,
            created_at: moment().toDate()
        });
        return {
            id: user.id
        }
    } else {
        return await SEQUELIZE.transaction(async trans => {
            const user: User = await User.create<User>({
                ...req.body,
                created_at: moment().toDate()
            });
            await Shipper.create<Shipper>({
                id: user.id,
                status: ALL_SHIPPER_STATUS.AVAILABLE,
                created_at: moment().toDate()
            });
            return {
                id: user.id
            }
        })
    }
}));


const editUser = _ajv({
    '@full_name': 'string|>0',
    '@phone': 'string|>0',
    '@blocked': 'boolean',
    '++': false
});

router.put('/:id([0-9]+)', _.validBody(editUser), _.routeAsync(async (req, res, next) => {
    let userId = parseInt(req.params.id);
    await User.update(req.body, { where: { id: userId } });

    return HC.SUCCESS;
}));


// router.get('/:type', _.routeAsync(async (req) => {
const registerNotification = _ajv({
    '+@player_id': 'string',
});
router.put('/register-notification', _.validBody(registerNotification), AuthServ.authType(ALL_USER_TYPE.SHIPPER), _.routeAsync(async (req) => {
    const user: User = req.session.user;
    const playerId: string = req.body.player_id;

    const pushNoti = await PushNotification.upsert({
        player_id: playerId,
        user: user.id
    });

    return HC.SUCCESS;
}));


router.get('/', _.routeAsync(async (req) => {
    const type = req.query.type;
    const shippers: User[] = await User.findAll<User>({
        where: {
            type: type,
        }
    });
    return shippers || [];
}));


// In Express 4.x, the * character in regular expressions is not interpreted in the usual way. 
// As a workaround, use {0,} instead of *. This will likely be fixed in Express 5.
router.get('/:ids(([0-9]+((,[0-9]+){0,})))', _.routeAsync(async (req, res) => {
    let ids = req.params.ids.split(',').map(n => parseInt(n));

    return await User.findAll({
        where: {
            id: {
                $or: ids
            }
        }
    })
}));

export default router;
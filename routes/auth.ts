// Import libraries here
import * as express from 'express';
import * as moment from 'moment';

// Import utils
import HC from '../glob/hc';
import ERR from '../glob/err';

import _ from 'utils-nodejs';
import ajv2 from 'ajv2';
import { ALL_USER_TYPE, USER_TYPE, ALL_SHIPPER_STATUS } from '../glob/cf';
// Import models here
import { User } from '../models/user';
// Import services here
import { AuthServ, IAuth } from '../serv/auth';
import { REDIS, SEQUELIZE } from '../glob/conn';
import { UserServ } from '../serv/user';
import { LOG } from '../serv/log';
import { Shipper } from '../models/shipper';

const router = express.Router();
const _ajv = ajv2();

const signUpBody = _ajv({
    '+@password': 'string|len>=6',
    '+@phone': 'string|len>0',
    '+@full_name': 'string',
    '+@type': 'string',
    '++': false
});
router.post('/signup', _.validBody(signUpBody), _.routeAsync(async (req) => {
    const phone: string = req.body.phone;
    const password: string = req.body.password;

    const user = await User.findOne<User>({ where: { phone: phone } });

    if (!_.isEmpty(user)) {
        throw _.logicError('Cannot signup', `Login name ${phone} is already registered`,
            409, ERR.OBJECT_ALREADY_EXISTS, phone);
    }

    const salt = _.randomstring.generate({ length: 32 });

    let newUser = User.build<User>({
        phone: phone,
        full_name: req.body.full_name,
        type: req.body.type,
        passwordSalt: salt,
        passwordHash: UserServ.getSHA1WithSalt(salt, password)
    });

    newUser = await AuthServ.registerAuth(newUser);
    await SEQUELIZE.transaction(async tr => {
        newUser = await newUser.save();
        await Shipper.create({
            id: newUser.id,
            status: ALL_SHIPPER_STATUS.AVAILABLE,
            created_at: moment().toDate()
        })
    });
    return { id: newUser.id };
}));

const loginBody = _ajv({
    '+@phone': 'string',
    '+@password': 'string|>=6',
    '++': false
});
router.post('/login', _.validBody(loginBody), _.routeAsync(async (req) => {
    const phone: string = req.body.phone;
    const password: string = req.body.password;

    const user = await User.findOne<User>({ where: { phone: phone } });

    if (_.isEmpty(user)) {
        throw _.logicError('Invalid username', `Username ${phone} are not exist`, 400, ERR.INVALID_USERNAME_OR_PASSWORD, phone);
    }

    if (UserServ.getSHA1(user, password) != user.passwordHash) {
        throw _.logicError('Invalid password', 'Password input are incorrect', 400, ERR.INVALID_USERNAME_OR_PASSWORD);
    }

    const auth = await AuthServ.authKongToken(user, user.passwordHash);

    return {
        user: UserServ.getUserInfo(user),
        auth: auth
    };
}));

export default router;
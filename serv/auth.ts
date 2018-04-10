// Import utils
import { ERR } from "../glob/err";
import _ from 'utils-nodejs';
import { USER_TYPE, APP_KEY } from "../glob/cf";
import * as request from 'request-promise';
import * as ENV from '../glob/env';

// Import models
import { User } from "../models/user";
import { HC } from "../glob/hc";
import { UserServ } from "./user";

export interface IAuthUserModel {
    getUserByAuthID(authID: string): Promise<User>;
}

export interface IAuthServConfig {
    UsernameField: string;
}

export interface IAuth {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
}

interface IOAuth2Credentials {
    client_id: string;
    client_secret: string;
}

export class AuthServ {

    static CONFIG = <IAuthServConfig>{
        UsernameField: 'X-Consumer-Username'
    };

    static MODEL: IAuthUserModel

    static authType(...types: USER_TYPE[]) {
        return _.routeNextableAsync(async (req, resp, next) => {
            // const user: User = await User.findById<User>(parseInt(req.header('userId')));

            const authID: string = req.header('X-Consumer-Username');
            if (_.isEmpty(authID.toString())) {
                throw _.logicError('Permission denied', 'Invalid user', 403, ERR.UNAUTHORIZED, authID);
            }

            const user: User = await UserServ.Cache.Auth.get(authID);
            if (_.isEmpty(user)) {
                throw _.logicError('Permission denied', 'User not found', 403, ERR.USER_NOT_FOUND);
            }

            if (user.blocked) {
                throw _.logicError('User is blocked', 'User is blocked', 403, ERR.BLOCKED);
            }

            if (!_.includes(types, user.type)) {
                throw _.logicError('Permission denied', 'Invalid role', 403, ERR.INVALID_ROLE);
            }

            req.session.user = user;
            if (!(req.originalUrl == `/locations/updated`)) {
                console.log(`User call: ${user.id} --- ${user.full_name}`);
            }

            next();
        });
    }

    static async registerAuth(user: User): Promise<User> {
        user = user || <User>{};
        user.authID = `${APP_KEY}@${_.randomstring.generate({ length: 16 })}`;

        const kongId = await this.createKongConsumer(user.authID);
        user.kongID = kongId;

        let oauth2 = await this.createOAuth2Credentials(user.authID, kongId);
        if (_.isEmpty(oauth2.client_id) || _.isEmpty(oauth2.client_secret)) {
            oauth2 = await this.getOAuth2Credentials(kongId);
        }

        user.kongClientID = oauth2.client_id;
        user.kongClientSecret = oauth2.client_secret;

        return user;
    }

    private static async createKongConsumer(username: string) {
        const opts = {
            url: `${ENV.host_kong_admin}/consumers`,
            method: 'POST',
            form: {
                username: username
            },
            json: true
        };

        try {
            const data = await request(opts);
            return <string>data.id || null;
        }
        catch (ex) {
            const consumer = await this.getKongConsumer(username);
            return consumer.id;
        }
    }

    private static async getKongConsumer(username: string) {
        const opts = {
            url: `${ENV.host_kong_admin}/consumers/${username}`,
            method: 'GET',
            json: true
        };

        return await request(opts);
    }

    private static async getOAuth2Credentials(kongId: string) {
        const opts = {
            url: `${ENV.host_kong_admin}/consumers/${kongId}/oauth2`,
            method: 'GET',
            json: true
        };

        const body = await request(opts);
        return <IOAuth2Credentials>{
            client_id: body.client_id,
            client_secret: body.client_secret
        };
    }

    private static async createOAuth2Credentials(username: string, kongId: string) {
        const opts = {
            url: `${ENV.host_kong_admin}/consumers/${username}/oauth2`,
            method: 'POST',
            form: {
                name: username,
                redirect_uri: ENV.host_redirect
            },
            json: true
        };


        const body = await request(opts);
        return <IOAuth2Credentials>{
            client_id: body.client_id,
            client_secret: body.client_secret
        };
    }

    static async authKongToken(user: User, pass: string) {
        const url = `${ENV.host}/oauth2/token`;
        const body = {
            grant_type: 'password',
            client_id: user.kongClientID,
            client_secret: user.kongClientSecret,
            scope: 'mm-api',
            provision_key: HC.HOST_PROVISION,
            authenticated_userid: user.kongID,
            username: user.authID,
            password: pass
        }

        const data: IAuth = await request({
            url,
            form: body,
            method: 'POST',
            json: true
        });

        return data;
    }

    static async authKongTokenByRefreshToken(user: User, token: string) {
        const url = `${ENV.host}/oauth2/token`;
        const body = {
            grant_type: 'refresh_token',
            client_id: user.kongClientID,
            client_secret: user.kongClientSecret,
            refresh_token: token
        }

        const data = await request({
            url,
            form: body,
            method: 'POST',
            json: true
        });

        return data;
    }

    static AuthApiKey(...keys: string[]) {
        return _.routeNextableAsync(async (req, resp, next) => {
            const apikey = req.header('apikey') || (req.body && req.body['apikey']) || '';
            if (!_.includes(keys, apikey)) {
                throw _.logicError(`Invalid key authentication`, `Key ${apikey} are invalid`, 401, ERR.UNAUTHORIZED, apikey);
            }

            next();
        });
    }
}

import _ from 'utils-nodejs'
import { User } from '../models/user';
import { HC } from '../glob/hc';
import { USER_TYPE } from '../glob/cf';
import { LRUCache } from '../utils/Iru';

class UserCache {
    Log = new LRUCache<number, User>({
        factory: (uid) => User.findById<User>(uid, { attributes: ['id', 'phone', 'full_name'] }),
        // max: 300,
        // maxAge: 5000
    });

    Auth = new LRUCache<string, User>({
        factory: (authID) => User.findOne({ where: { authID: authID }, attributes: UserServ.InfoKeys }),
        // max: 300,
        // maxAge: 5000
    });

    del(user: User) {
        this.Log.del(user.id);
        this.Auth.del(user.authID);
    }
}

export class UserServ {
    static Cache = new UserCache();

    static getUserInfo(user: User) {
        return {
            id: user.id,
            full_name: user.full_name,
            phone: user.phone,
            type: user.type,
            updated_at: user.updated_at
        }
    }

    static get InfoKeys() {
        return ['id', 'full_name', 'phone', 'type'];
    }

    // static get InfoSelect() {
    //     return _.zipToObj(this.InfoKeys, k => 1);
    // }

    static getSHA1WithSalt(salt: string, password: string) {
        const pws = `${password}${salt}`;
        return _.sha1(pws);
    }

    static getSHA1(user: User, password: string) {
        return this.getSHA1WithSalt(user.passwordSalt, password);
    }

    // static async getUserByAuthID(authID: string) {
    //     return await User.findOne({ where: { authID: authID }, attributes: this.InfoSelect });
    // }

    // static info(user: User): User {
    //     return <User>_.pick(user, this.InfoKeys);
    // }

    static RedisLocationKey(userType: USER_TYPE) {
        switch (userType) {
            case "SHIPPER":
                return HC.KEY_DRIVER_LOCATION;
        }

        return undefined;
    }

    static RealtimeLocationRoom(user: User) {
        if (["SHIPPER"].find(t => t == user.type) != null) {
            return `MM:${user.type}:${user.id}`;
        }

        return undefined;
    }
}

export default UserServ;
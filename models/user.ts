// Import libraries
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript';

// Import utils
import * as CF from '../glob/cf';
import _ from 'utils-nodejs';
import { USER_TYPE } from '../glob/cf';

@Table({ tableName: 'user' })
export class User extends Model<User> {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'id' })
    id: number;

    @Column({ type: DataType.TEXT, field: 'full_name' })
    full_name: string;

    @Column({ type: DataType.TEXT, field: 'phone' })
    phone: string;

    @Column({ type: DataType.TEXT, field: 'type' })
    type: USER_TYPE;

    @Column({ type: DataType.TEXT, field: 'authID' })
    authID: string;

    @Column({ type: DataType.TEXT, field: 'kongID' })
    kongID: string;

    @Column({ type: DataType.TEXT, field: 'kongClientID' })
    kongClientID: string;

    @Column({ type: DataType.TEXT, field: 'kongClientSecret' })
    kongClientSecret: string;

    @Column({ type: DataType.TEXT, field: 'passwordSalt' })
    passwordSalt: string;

    @Column({ type: DataType.TEXT, field: 'passwordHash' })
    passwordHash: string;

    @Column({ type: DataType.BOOLEAN, field: 'blocked' })
    blocked: boolean;

    @Column({ type: DataType.DATE, field: 'created_at' })
    created_at: Date;

    @Column({ type: DataType.DATE, field: 'updated_at' })
    updated_at: Date;

    static getSHA1(user: User, password: string) {
        return this.getSHA1WithSalt(user.passwordSalt, password);
    }

    static getSHA1WithSalt(salt: string, password: string) {
        const pws = `${password}${salt}`;
        return _.sha1(pws);
    }

    static getUserByAuthID(authID: string): PromiseLike<User> {
        return this.findOne<User>({ where: { authID: authID } });
    }

    static readonly InfoFields = ['id', 'last_name', 'first_name', 'phone', 'email', 'type', 'avatar', 'address', 'updated_at', 'blocked'];

    static async rawUpdate(id: number, data: any) {
        const tableName = this.getTableName() as string
        const fields: string[] = _.keys(data);
        const seq = this.schema(tableName).sequelize;

        if (_.isEmpty(fields) || _.isEmpty(seq)) {
            return;
        }

        const query = `UPDATE \`${tableName}\` SET ` +
            fields.map(f => `\`${f}\` = :${f}`).join(', ') +
            ' WHERE `id` = :id';

        const replacements = _.merge({}, data, { id: id });
        await seq.query(query, { replacements: replacements });
    }
}

export default User;
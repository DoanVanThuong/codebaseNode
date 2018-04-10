// Import libraries
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, HasOne, BelongsTo } from 'sequelize-typescript';

// Import utils
import * as CF from '../glob/cf';
import { Batch } from './batch';

@Table({ tableName: 'order' })
export class Order extends Model<Order> {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'id' })
    id: number;

    @Column({ type: DataType.STRING, field: 'customer' })
    customer: string;

    @Column({ type: DataType.STRING, field: 'code' })
    code: string

    @Column({ type: DataType.INTEGER, field: 'total' })
    total: number;

    @Column({ type: DataType.INTEGER, field: 'batch' })
    batch: number;

    @Column({ type: DataType.STRING, field: 'status' })
    status: string;

    @Column({ type: DataType.DATE, field: 'created_at' })
    created_at: Date;
}

export default Order;


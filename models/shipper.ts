// Import libraries
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript';

// Import utils
import * as CF from '../glob/cf';

@Table({ tableName: 'shipper' })
export class Shipper extends Model<Shipper> {

    @PrimaryKey
    @Column({ type: DataType.INTEGER, field: 'id' })
    id: number;

    @Column({ type: DataType.STRING, field: 'status' })
    status: string;

    @Column({ type: DataType.DATE, field: 'created_at' })
    created_at: Date;
}

export default Shipper;


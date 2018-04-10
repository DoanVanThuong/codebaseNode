import * as moment from 'moment';
import Order from '../models/order';
import { Transaction } from 'sequelize';
import { ORDER_STATUS, ALL_ORDER_STATUS } from '../glob/cf';

export interface IOrder {
    customer: string;
    code: string;
    total: number;
    batch: number;
}

export class OrderServ {
    static async createOrder(order: IOrder, trans: Transaction): Promise<number> {
        const od = await Order.create<Order>({
            customer: order.customer,
            code: order.code,
            total: order.total,
            status: ALL_ORDER_STATUS.WAITING,
            batch: order.batch,
            created_at: moment().toDate()
        }, { transaction: trans })

        return od.id;
    }
}
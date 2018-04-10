import * as moment from 'moment';
import Order from '../models/order';
import Batch from '../models/batch';
import { BATCH_STATUS, BATCH_PAYMENT_METHOD, ALL_BATCH_STATUS } from '../glob/cf';
import { IOrder, OrderServ } from './order';
import { SEQUELIZE } from '../glob/conn';


export interface IOrderData {
    code: string;
    total: number;
}

export interface IBatch {
    customer: string;
    customer_address: string;
    lat: number;
    lng: number;
    payment_method: string;
    code: string;
    total: number;
    status: string;
    category: string;
    note: string;
    orders: IOrderData[];
}

export class BatchServ {
    static async createBatch(batchObj: IBatch): Promise<number> {
        return await SEQUELIZE.transaction(async trans => {
            const batch: Batch = await Batch.create<Batch>({
                customer: batchObj.customer,
                customer_address: batchObj.customer_address,
                lat: batchObj.lat,
                lng: batchObj.lng,
                payment_method: batchObj.payment_method,
                code: batchObj.code,
                total: batchObj.total,
                status: ALL_BATCH_STATUS.WAITING,
                category: batchObj.category,
                note: batchObj.note,
                delivery_trip: null,
                created_at: moment().toDate()
            });

            await Order.bulkCreate(
                batchObj.orders.map(orderData => {
                    return {
                        ...orderData,
                        customer: batch.customer,
                        batch: batch.id,
                        created_at: moment().toDate()
                    }
                })
                , { transaction: trans });

            return batch.id;
        })
    }


    static async editBatch(batchId: number, editObj: Object) {
        if (editObj['outbound_time']) {
            editObj['outbound_time'] = new Date(editObj['outbound_time']);
        }
        await Batch.update(editObj, { where: { id: batchId } });
    }
}
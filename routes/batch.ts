import { Request, Response, Router } from "express";
import ajv2 from 'ajv2'
import _ from 'utils-nodejs'
import { BATCH_STATUS, ORDER_STATUS, BATCH_PAYMENT_METHOD, BATCH_CATEGORY, ALL_BATCH_STATUS_ARR, ALL_BATCH_CATEGORY_ARR, ALL_BATCH_PAYMENT_METHOD, ALL_BATCH_STATUS, ALL_BATCH_PAYMENT_METHOD_ARR, ALL_DELIVERYTRIP_STATUS } from "../glob/cf";
import { BatchServ } from "../serv/batch";
import { Batch } from "../models/batch";
import { ERR } from "../glob/err";
import { OrderServ } from "../serv/order";
import { HC } from "../glob/hc";
import { DeliveryTrip } from "../models/deliveryTrip";
import { Sequelize } from "sequelize-typescript";

const router = Router();

const _ajv = ajv2();
const createBatch = _ajv({
    '+@customer': 'string',
    '+@customer_address': 'string|>0',
    '+@lat': 'number|>=-90|<=90',
    '+@lng': 'number|>=-180|<=180',
    '+payment_method': { enum: ALL_BATCH_PAYMENT_METHOD_ARR },
    '+category': { enum: ALL_BATCH_CATEGORY_ARR },
    '+@note': 'string',
    'orders': {
        'type': 'array',
        '@items': {
            '+@code': 'string|>0',
            '+@total': 'number|>=0',
        }
    },
    '++': false
});


router.post('/', _.validBody(createBatch), _.routeAsync(async (req) => {
    const batchId = await BatchServ.createBatch(req.body);
    return {
        id: batchId
    }
}));

const checkedBatchBody = _ajv({
    '+@outbound_time': 'number',
    '+@note': 'string',
    '++': false
})

router.put('/:id/checked', _.validBody(checkedBatchBody), _.routeAsync(async req => {
    const batchId = parseInt(req.params.id);
    let batch = await Batch.findById<Batch>(batchId);

    if (!batch) {
        throw _.logicError('Not found', `Not found batch with id ${batchId}`, 404, ERR.OBJECT_NOT_FOUND, req.params.id);
    }

    if (batch.status === ALL_BATCH_STATUS.WAITING) {
        batch.status = ALL_BATCH_STATUS.CHECKED;
        batch.note = req.body['note'];
        batch.outbound_time = new Date(req.body['outbound_time']);
        await batch.save();
    } else {
        throw _.logicError('Permission denied', `Batch ${batchId} with status ${batch.status} cannot change to CHECKED`, 403, ERR.INVALID_ROLE, req.params.id);
    }

    return HC.SUCCESS;
}));


router.put('/:id/error', _.validBody(checkedBatchBody), _.routeAsync(async req => {
    const batchId = parseInt(req.params.id);
    let batch = await Batch.findById<Batch>(batchId);

    if (!batch) {
        throw _.logicError('Not found', `Not found batch with id ${batchId}`, 404, ERR.OBJECT_NOT_FOUND, req.params.id);
    }

    if (batch.status === ALL_BATCH_STATUS.COMPLETED) {
        throw _.logicError('Permission denied', `THIS BATCH WAS COMPLETED`, 403, ERR.INVALID_ROLE, req.params.id);
    } else {
        batch.status = ALL_BATCH_STATUS.ERROR;
        await batch.save();
    }

    return HC.SUCCESS;
}));

router.get('', _.routeAsync(async req => {
    const statuses = req.query.status;
    let listStatus: BATCH_STATUS[] = [];
    if (!statuses) {
        listStatus = ALL_BATCH_STATUS_ARR;
    } else {
        listStatus = (<string>statuses).split(',').map(s => ALL_BATCH_STATUS[s.trim()])
    }

    let limit = parseInt(req.query.limit);
    let sinceId = parseInt(req.query.sinceId);

    if (isNaN(limit)) {
        limit = Number.MAX_SAFE_INTEGER;
    }

    if (isNaN(sinceId)) {
        sinceId = Number.MAX_SAFE_INTEGER;
    }

    return Batch.findAll({ where: { id: { $lte: sinceId } }, limit: limit, order: [['id', 'DESC']] });
}));

// router.get('/:id([0-9]+)', _.routeAsync(async req => {
//     let batchId = parseInt(req.params.id);
//     let batch = await Batch.findOne({ where: { id: batchId } });
//     if (batch) {
//         return batch;
//     } else {
//         throw _.logicError('Not found', 'No batch match this id', 404, ERR.OBJECT_NOT_FOUND, req.params.id);
//     }
// }));

router.get('/:ids', _.routeAsync(async req => {
    const batchIds: number[] = _.split(req.params.ids, ",").map(id => parseInt(id));
    const batchs: Batch[] = await Batch.findAll<Batch>({ where: { id: batchIds } });
    return batchs || [];
}));

router.get('/delivery/:ids', _.routeAsync(async (req) => {
    const ids: number[] = _.split(req.params.ids, ",").map(id => parseInt(id));
    const delevery: DeliveryTrip[] = await DeliveryTrip.findAll<DeliveryTrip>({
        where: {
            id: ids,
            // status: ALL_DELIVERYTRIP_STATUS.WAITING
        }
    });
    const deliveryIds = delevery.map(item => {
        return item.id;
    });

    const batch: Batch[] = await Batch.findAll<Batch>({
        where: {
            delivery_trip: deliveryIds,
            // status: ALL_BATCH_STATUS.READY
        },
        // attributes: ['delivery_trip', [Sequelize.fn('count', Sequelize.col('delivery_trip')), "numOfBatch"]],
        // group: 'delivery_trip',
        // raw: true
    });

    const data = _.groupBy(batch, 'delivery_trip');
    return data || [];
}));
export default router;
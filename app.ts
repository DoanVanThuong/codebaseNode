import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as moment from 'moment';

import * as ENV from './glob/env';
import * as CONN from './glob/conn';
import HC from './glob/hc';
import _ from 'utils-nodejs';

import SessionServ from './serv/sess';
// Import routers

import batchRouter from './routes/batch';
import usersRouter from './routes/users';
import shiperRouter from './routes/shippers';
import truckRouter from './routes/truck';
import authRouter from './routes/auth';
import subcribeRouter from './routes/subscribe';
import orderRoute from './routes/order';
import DeliveryTripRoute from './routes/deliveryTrip';
class Program {
    public static async main(): Promise<number> {
        ENV.configure("stag");
        await CONN.configureConnections();
        // init things
        // AppServ.initData();

        const server = express();
        server.use(bodyParser.json());
        // create session object
        server.use(SessionServ());
        // AuthServ.MODEL = UserModel;

        server.all('*', (req, resp, next) => {
            console.log(`${req.method}: ${req.url}`);
            if (!_.isEmpty(req.body)) {
                console.log(JSON.stringify(req.body, null, 2));
            }
            next();
        });
        // CORS
        server.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', "*");
            res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Max-Age', '86400');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, ' +
                'Content-Type, Accept, Authentication, Authorization, sess, apikey, userId');

            if (req.method.toUpperCase() == 'OPTIONS') {
                res.statusCode = 204;
                res.send();
                return;
            }
            next();
        });

        // Configure routes
        server.use('/delivery-trip', DeliveryTripRoute);

        server.use('/batchs', batchRouter);

        server.use('/orders', orderRoute);

        server.use('/users', usersRouter);

        server.use('/shippers', shiperRouter);

        server.use('/trucks', truckRouter);

        server.use('/auth', authRouter);

        server.use('/subcribes', subcribeRouter);

        // Start server
        server.listen(ENV.port, async function () {
            console.log("Listen on port " + ENV.port + " ...");
        });

        return 0;
    }
}

Program.main();
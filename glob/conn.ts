import { Sequelize } from 'sequelize-typescript';
import * as redis from 'redis';
import * as elasticsearch from 'elasticsearch';
import * as mongodb from 'mongodb';

import * as ENV from './env'
import * as ConnRedis from 'module-redis-typescript'

// ************ CONFIGS ************

export let SEQUELIZE: Sequelize;
export let REDIS: ConnRedis.IConnRedis;
export let ELASTIC: elasticsearch.Client;
export let MONGODB: mongodb.Db;

export async function configureConnections() {
    if (ENV.name == ENV.ENV_NAME.PRODUCTION) {
        SEQUELIZE = new Sequelize({
            host: 'sv.db.mpex.vn',
            name: 'mm_stag',
            dialect: 'mysql',
            username: 'mm_stag',
            password: 'rUNMrWBv8aNGZMm2',
            logging: false,
            modelPaths: [__dirname + '/../models']
        });

        ELASTIC = new elasticsearch.Client({
            host: 'http://elastic.mpex.vn:8000',
            log: [{
                type: 'stdio',
                levels: ['error'] // change these options
            }],
            httpAuth: `truongpn:truongpn`,
        });
    }



}


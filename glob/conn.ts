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
            host: 'http://localhost/phpmyadmin/',
            name: 'mm_stag',
            dialect: 'mysql',
            username: 'root',
            password: '',
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
    else if (ENV.name == ENV.ENV_NAME.STAGING) {
        SEQUELIZE = new Sequelize({
            host: 'localhost',
            name: 'mm_stag',
            dialect: 'mysql',
            username: 'root',
            password: '',
            port: 3306,
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


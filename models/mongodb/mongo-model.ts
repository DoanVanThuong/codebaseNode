import * as mongodb from 'mongodb';

import { MONGODB } from '../../glob/conn';
import _ from 'utils-nodejs'

export interface IMongoModel {
    _id?: mongodb.ObjectID;
    __v?: number;
}

export class BaseModel {
}

export default BaseModel;
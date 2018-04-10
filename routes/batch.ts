import { Request, Response, Router } from "express";
import ajv2 from 'ajv2'
import _ from 'utils-nodejs'
import { Sequelize } from "sequelize-typescript";

const router = Router();
const _ajv = ajv2();

export default router;
import * as moment from 'moment';
import * as bases from 'bases';
import * as pad from 'string-padding';

import HC from '../glob/hc';
import { REDIS } from '../glob/conn';
import _ from 'utils-nodejs';
import { QPR } from '../utils/qpr';

export class GenServ {
    static readonly QPRPrime = QPR.findQPRPrime(34000000);
    static readonly DAY_XOR_SH = 10946503;
    static readonly DAY_XOR_SN = 28463613;
    static readonly DAY_XOR_DM = 21813214;

    static async genParcelCode() {
        const todayNum = moment().diff(HC.BEGIN_DATE, 'd');
        const todayCode = bases.toAlphabet(todayNum, HC.HUMAN32_ALPHABET);
        const todayXOR = QPR.generate(todayNum, this.QPRPrime, this.DAY_XOR_SH);
        const redisKey = `msh:code:${todayCode}`;
        const codeInNumber: number = await REDIS.incr(redisKey);
        const code = bases.toAlphabet(QPR.generate(codeInNumber, this.QPRPrime, todayXOR), HC.HUMAN32_ALPHABET);
        return `MSH${pad(todayCode, 3, '0')}${pad(code, 5, '0')}`;
    }

}

export default GenServ;
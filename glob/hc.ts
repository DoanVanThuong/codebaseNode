import * as moment from 'moment';

export class HC {
    static readonly SUCCESS = { success: true };
    static readonly FAILURE = { success: false };

    static readonly MINUTES_PER_DAY = 24 * 60;
    static readonly BEGIN_DATE = moment('2010-01-01', 'YYYY-MM-DD');
    static readonly HUMAN32_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    static readonly HOST_PROVISION = 'Fy1dmMyxKyDV2AhIjyuma8D3P9xNIOicB8oONYD7z5o9xRATlEAxiWzuA5FGVGhm';
    static readonly DATETIME_FMT = 'YYYY-MM-DD HH:mm:ss';
    static readonly APIKEY_REALTIME = 'zDaNJaeJ705GcFHq9Q06SN1ZwZl0LMxu';
    static readonly APIKEY = 'zDaNJaeJ705GcFHq9Q06SN1ZwZl0LMxu';

    static readonly KEY_DRIVER_LOCATION = 'MM:GEO:DRIVER';
    static readonly UNIT = "km";

    static readonly APIKEY_ONESIGNAL = 'ZDQyNTUzMGQtOTU0ZS00YTgwLWJkYWEtNTAxYmI2MjU3NDIz';
}

export default HC;
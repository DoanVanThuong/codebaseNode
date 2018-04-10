export const ERR = {
    // Common error (-1 -> -99)
    UNKNOWN: -1,
    UNAUTHORIZED: -2,
    INVALID_ROLE: -3,
    OBJECT_NOT_FOUND: -4,
    INVALID_FORMAT: -5,
    INVALID_VERSION: -6,
    INVALID_STATUS: -7,
    COULD_NOT_DELETE: -8,
    INVALID_TYPE: -9,
    OBJECT_ALREADY_EXISTS: -11,
    BLOCKED: -13,

    // Login (-101 -> -199)
    INVALID_USERNAME_OR_PASSWORD: -101,
    REFRESH_TOKEN_NOT_FOUND: -102,
    REFRESH_TOKEN_IS_EXPIRED: -103,
    REGISTER_FAILED: -104,
    INVALID_ACCOUNT_TYPE: -105,
    INVALID_PHONE: -106,
    USER_NOT_FOUND: -107,
    PHONE_NOT_FOUND: -108,

    // User profile: (-201 -> -299)
    OLD_PASSWORD_WRONG: -201,
    INVALID_PASSWORD_FORMAT: -202,
    EMAIL_ALREADY_EXISTS: -203,

    //DELIVERYTRIP
    BATH_INVALID: -301,
    DELIVERYTRIP_STATUS_INVALID: -302

};

export default ERR;
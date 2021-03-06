/**
 * Mainnet Cash
 * A developer friendly bitcoin cash wallet api  This API is currently in active development, breaking changes may be made prior to official release of version 1.  **Important:** This library is in active development 
 *
 * The version of the OpenAPI document: 0.0.1-rc
 * Contact: hello@mainnet.cash
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { BalanceResponse } from './balanceResponse';

export class SendResponse {
    /**
    * The hash of a transaction
    */
    'txId'?: string;
    'balance'?: BalanceResponse;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "txId",
            "baseName": "txId",
            "type": "string"
        },
        {
            "name": "balance",
            "baseName": "balance",
            "type": "BalanceResponse"
        }    ];

    static getAttributeTypeMap() {
        return SendResponse.attributeTypeMap;
    }
}


/**
 * Mainnet Cash
 * A developer friendly bitcoin cash wallet api  This API is currently in active development, breaking changes may be made prior to official release of version 1.  **Important:** modifying this library to prematurely operate on mainnet may result in loss of funds 
 *
 * The version of the OpenAPI document: 0.0.3
 * Contact: hello@mainnet.cash
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { SerializedWallet } from './serializedWallet';
import { ToCashaddr } from './toCashaddr';

export class SendMaxRequest {
    /**
    * ID that is returned in `wallet` field of /wallet call 
    */
    'walletId': string;
    'cashaddr': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "walletId",
            "baseName": "walletId",
            "type": "string"
        },
        {
            "name": "cashaddr",
            "baseName": "cashaddr",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return SendMaxRequest.attributeTypeMap;
    }
}


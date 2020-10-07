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

export class RegCashaddr {
    'cashaddr'?: string;

    static discriminator: string | undefined = "regcashaddr";

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "cashaddr",
            "baseName": "cashaddr",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return RegCashaddr.attributeTypeMap;
    }
}


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
import { Network } from './network';
import { SerializedWallet } from './serializedWallet';

export class WalletResponse extends SerializedWallet {
    /**
    * The wallet in Wallet Import Format (WIF) 
    */
    'wif'?: string;
    /**
    * User defined string for wallet
    */
    'name'?: string;
    /**
    * The address in cashaddr format. 
    */
    'cashaddr'?: string;
    /**
    * network type
    */
    'network'?: WalletResponse.NetworkEnum;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "wif",
            "baseName": "wif",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "cashaddr",
            "baseName": "cashaddr",
            "type": "string"
        },
        {
            "name": "network",
            "baseName": "network",
            "type": "WalletResponse.NetworkEnum"
        }    ];

    static getAttributeTypeMap() {
        return super.getAttributeTypeMap().concat(WalletResponse.attributeTypeMap);
    }
}

export namespace WalletResponse {
    export enum NetworkEnum {
        Mainnet = <any> 'mainnet',
        Testnet = <any> 'testnet',
        Regtest = <any> 'regtest',
        Simtest = <any> 'simtest'
    }
}

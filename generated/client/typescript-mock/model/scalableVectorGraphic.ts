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

export class ScalableVectorGraphic {
    /**
    * A Qr code image data in svg format as utf-8 encoded string. Suitable for inclusion in html using:     - \\<img src\\=\\\"**data:image/svg+xml;base64,PD94bWwgdm... ==**\"\\>       
    */
    'src'?: string;
    /**
    * hover text for graphic
    */
    'title'?: string;
    /**
    * assistive text
    */
    'alt'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "src",
            "baseName": "src",
            "type": "string"
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string"
        },
        {
            "name": "alt",
            "baseName": "alt",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return ScalableVectorGraphic.attributeTypeMap;
    }
}


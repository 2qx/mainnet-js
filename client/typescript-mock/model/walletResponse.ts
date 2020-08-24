/**
 * Mainnet Cash
 * \"A developer friendly bitcoin cash wallet api  This API is currently in active development, breaking changes may \\nbe made prior to release of version\\ \\ 1.\\n\\n**Important:** modifying this library to prematurely operate on mainnet\\n\\ \\ may result in loss of funds\\n\"
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: hello@mainnet.cash
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from "../api";

export class WalletResponse {
  /**
   * User defined string for wallet
   */
  "name"?: string;
  /**
   * Wallet type, either a single wallet with private key (wif) or  a Hierarchical Deterministic wallet determined from a seed.
   */
  "type"?: WalletResponse.TypeEnum;
  /**
   * The address in cashaddr format.
   */
  "cashaddress"?: string;
  /**
   * network type
   */
  "network"?: WalletResponse.NetworkEnum;
  /**
   * All information necessary to reconstruct a wallet, in serialized string format
   */
  "wallet"?: string;
  /**
   * The wallet in Wallet Import Format
   */
  "wif"?: string;

  static discriminator: string | undefined = undefined;

  static attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
  }> = [
    {
      name: "name",
      baseName: "name",
      type: "string",
    },
    {
      name: "type",
      baseName: "type",
      type: "WalletResponse.TypeEnum",
    },
    {
      name: "cashaddress",
      baseName: "cashaddress",
      type: "string",
    },
    {
      name: "network",
      baseName: "network",
      type: "WalletResponse.NetworkEnum",
    },
    {
      name: "wallet",
      baseName: "wallet",
      type: "string",
    },
    {
      name: "wif",
      baseName: "wif",
      type: "string",
    },
  ];

  static getAttributeTypeMap() {
    return WalletResponse.attributeTypeMap;
  }
}

export namespace WalletResponse {
  export enum TypeEnum {
    Wif = <any>"wif",
    Hd = <any>"hd",
  }
  export enum NetworkEnum {
    Mainnet = <any>"mainnet",
    Testnet = <any>"testnet",
    Regtest = <any>"regtest",
  }
}

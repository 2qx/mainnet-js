// @ts-ignore
import { Service } from "./Service";
import { Wallet, RegTestWallet, TestnetWallet } from "../../../src/wallet/Wif";
import { WalletRequest } from "../../client/typescript-mock/model/walletRequest";
import { WalletResponse } from "../../client/typescript-mock/model/walletResponse";
import { WalletType } from "../../client/typescript-mock/model/walletType";

/**
 * create a new wallet
 *
 * body WalletRequest Request a new new random wallet
 * returns WalletResponse
 * */
export const createWallet = ({ body }: { body: WalletRequest }) =>
  new Promise(async (resolve, reject) => {
    try {
      let w: Wallet | null;
      let resp = new WalletResponse();
      switch (body.network) {
        case WalletRequest.NetworkEnum.Regtest:
          w = new RegTestWallet(body.name);
          resp.network = WalletResponse.NetworkEnum.Regtest;
          break;
        case WalletRequest.NetworkEnum.Testnet:
          w = new TestnetWallet(body.name);
          resp.network = WalletResponse.NetworkEnum.Testnet;
          break;
        case WalletRequest.NetworkEnum.Mainnet:
          resp.network = WalletResponse.NetworkEnum.Mainnet;
        default:
          throw Error("The wallet network was not understood");
      }
      if (w) {
        switch (body.type) {
          case WalletRequest.TypeEnum.Wif:
            await w.generateWif();
            resp.wif = w.privateKeyWif;
            break;
          case WalletRequest.TypeEnum.Hd:
            throw Error("Not Implemented");
        }

        resp.name = w.name;
        resp.cashaddr = w.cashaddr;
        resp.walletId = w.getSerializedWallet();
        resolve(Service.successResponse({ ...resp }));
      }
    } catch (e) {
      console.log(JSON.stringify(e));
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 500)
      );
    }
  });

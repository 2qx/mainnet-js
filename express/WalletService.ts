import { Service } from "../generated/serve/services/Service";
import { walletFromIdString } from "../src/wallet/createWallet";
import { createWalletResponse } from "../src/wallet/createWallet";
export { send } from "./send";
export { sendMax } from "./sendMax";

/**
 * create a new wallet
 *
 * body WalletRequest Request a new new random wallet
 * returns WalletResponse
 * */
export const createWallet = (request) =>
  new Promise(async (resolve, reject) => {
    try {
      let resp = await createWalletResponse(request.body);
      resolve(Service.successResponse({ ...resp }));
    } catch (e) {
      console.log(JSON.stringify(e));
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 500)
      );
    }
  });

/**
 * methodOnWallet handle most other api calls on a wallet
 *
 * takes a walletId and some other arguments
 * */
const methodOnWallet = (request: any, method): Promise<any> =>
  new Promise(async (resolve, reject) => {
    try {
      let wallet = await walletFromIdString(request.body.walletId);
      let args = request.body;
      delete args.walletId;
      let resp = await wallet[method](args);
      resolve(Service.successResponse({ ...resp }));
    } catch (e) {
      console.log(e);
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 500)
      );
    }
  });

export const balance = (request) => methodOnWallet(request, "getBalance");
export const depositAddress = (request) =>
  methodOnWallet(request, "getDepositAddress");
export const depositQr = (request) => methodOnWallet(request, "getDepositQr");
export const maxAmountToSend = (request) =>
  methodOnWallet(request, "getMaxAmountToSend");
// export const send = (request) => methodOnWallet(request, "send")
// export const sendMax = (request) => methodOnWallet(request, "sendMax")
export const utxos = (request) => methodOnWallet(request, "getUtxos");

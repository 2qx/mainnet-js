process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { UnitEnum, WalletTypeEnum } from "./wallet/enum";
import { bchParam } from "./chain";
import { RegTestWallet } from "./wallet/Wif";
import { createWallet, walletFromIdString } from "./wallet/createWallet";
import { BalanceResponse } from "./util/balanceObjectFromSatoshi";

test("Should get the regtest wallet balance", async () => {
  // Build Alice's wallet from Wallet Import Format string, send some sats
  if (!process.env.PRIVATE_WIF) {
    throw Error("Attempted to pass an empty WIF");
  } else {
    let alice = await RegTestWallet.fromWIF(process.env.PRIVATE_WIF); // insert WIF from #1
    // Build Bob's wallet from a public address, check his balance.
    const aliceBalance = (await alice.getBalance()) as BalanceResponse;
    expect(aliceBalance.bch).toBeGreaterThan(5000);
    expect(await alice.getBalance("sat")).toBeGreaterThan(
      5000 * bchParam.subUnits
    );
  }
});

test("Send a transaction on the regression network", async () => {
  // Build Alice's wallet from Wallet Import Format string, send some sats
  if (!process.env.PRIVATE_WIF) {
    throw Error("Attempted to pass an empty WIF");
  } else {
    let alice = await RegTestWallet.fromWIF(process.env.PRIVATE_WIF); // insert WIF from #1
    const bob = await createWallet({
      type: WalletTypeEnum.Wif,
      network: "regtest",
      name: "Bob's random wallet",
    });
    await alice.send([
      {
        cashaddr: bob.cashaddr!,
        value: 1100,
        unit: UnitEnum.SAT,
      },
    ]);
    // Build Bob's wallet from a public address, check his balance.
    const bobBalance = (await bob.getBalance()) as BalanceResponse;
    expect(bobBalance.sat).toBe(1100);
  }
});

test("Send a transaction (as array) on the regression network", async () => {
  // Build Alice's wallet from Wallet Import Format string, send some sats
  if (!process.env.PRIVATE_WIF) {
    throw Error("Attempted to pass an empty WIF");
  } else {
    let alice = await RegTestWallet.fromWIF(process.env.PRIVATE_WIF); // insert WIF from #1
    const bob = await createWallet({
      network: "regtest",
    });
    await alice.send([[bob.cashaddr!, 1200, UnitEnum.SAT]]);
    // Build Bob's wallet from a public address, check his balance.
    const bobBalance = (await bob.getBalance()) as BalanceResponse;
    expect(bobBalance.sat).toBe(1200);
  }
});

test("Send a transaction on testnet", async () => {
  // Build Alice's wallet from Wallet Import Format string, send some sats

  if (!process.env.ALICE_TESTNET_WALLET_ID) {
    throw Error("Missing testnet env keys");
  }
  const alice = await walletFromIdString(process.env.ALICE_TESTNET_WALLET_ID);
  const bob = await createWallet({
    type: WalletTypeEnum.Wif,
    network: "testnet",
    name: "Bob's random wallet",
  });

  if (!alice.cashaddr || !bob.cashaddr) {
    throw Error("Alice or Bob's wallet are missing addresses");
  }
  if (!alice.privateKey || !bob.privateKey) {
    throw Error("Alice or Bob's wallet are missing private ke");
  }
  await alice.send([
    {
      cashaddr: bob.cashaddr,
      value: 1100,
      unit: UnitEnum.SAT,
    },
  ]);

  // Build Bob's wallet from a public address, check his balance.
  
  await bob.sendMax({ cashaddr: alice.cashaddr });
  const bobBalanceFinal = (await bob.getBalance()) as BalanceResponse;
  expect(bobBalanceFinal.sat).toBe(0);
});

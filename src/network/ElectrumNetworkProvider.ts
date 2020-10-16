import {
  ElectrumCluster,
  ElectrumClient,
  ElectrumTransport,
  ClusterOrder,
  RequestResponse,
} from "electrum-cash";
import NetworkProvider from "./NetworkProvider";
import { Utxo, Network } from "../interface";

export default class ElectrumNetworkProvider implements NetworkProvider {
  private electrum: ElectrumCluster | ElectrumClient;
  private concurrentRequests: number = 0;
  private isCluster: boolean = true;

  constructor(
    public network: Network = Network.MAINNET,
    electrum?: ElectrumCluster | ElectrumClient,
    private manualConnectionManagement?: boolean
  ) {
    // If a custom Electrum Cluster is passed, we use it instead of the default.
    if (electrum) {
      this.electrum = electrum;
      this.isCluster =
        electrum.constructor.name === "ElectrumCluster" ? true : false;
      return;
    }

    if (network === Network.MAINNET) {
      this.isCluster = true;
      // Initialize a 2-of-3 Electrum Cluster with 6 reliable hardcoded servers
      // using the first three servers as "priority" servers
      this.electrum = new ElectrumCluster(
        "Mainnet",
        "1.4.1",
        2,
        3,
        ClusterOrder.PRIORITY,
        550
      );
      this.electrum.addServer(
        "fulcrum.fountainhead.cash",
        50002,
        ElectrumTransport.TCP_TLS.Scheme,
        false
      );
      this.electrum.addServer(
        "bch.imaginary.cash",
        50002,
        ElectrumTransport.TCP_TLS.Scheme,
        false
      );
      this.electrum.addServer(
        "electrum.imaginary.cash",
        50002,
        ElectrumTransport.TCP_TLS.Scheme,
        false
      );
      this.electrum.addServer(
        "blackie.c3-soft.com",
        50002,
        ElectrumTransport.TCP_TLS.Scheme,
        false
      );
      this.electrum.addServer(
        "bch.imaginary.cash",
        50004,
        ElectrumTransport.WSS.Scheme,
        false
      );
      this.electrum.addServer(
        "blackie.c3-soft.com",
        50004,
        ElectrumTransport.WSS.Scheme,
        false
      );
      this.electrum.addServer(
        "electroncash.de",
        60002,
        ElectrumTransport.WSS.Scheme,
        false
      );
      this.electrum.addServer(
        "electroncash.dk",
        50004,
        ElectrumTransport.WSS.Scheme,
        false
      );
      this.electrum.addServer(
        "bch.loping.net",
        50004,
        ElectrumTransport.WSS.Scheme,
        false
      );
      this.electrum.addServer(
        "electrum.imaginary.cash",
        50004,
        ElectrumTransport.WSS.Scheme,
        false
      );
    } else if (network === Network.TESTNET) {
      this.isCluster = true;
      // Initialize a 1-of-2 Electrum Cluster with 2 hardcoded servers
      this.electrum = new ElectrumCluster(
        "CashScript Application",
        "1.4.1",
        1,
        1,
        undefined
      );
      this.electrum.addServer(
        "blackie.c3-soft.com",
        60004,
        ElectrumTransport.WSS.Scheme,
        false
      );
      this.electrum.addServer(
        "electroncash.de",
        60004,
        ElectrumTransport.WSS.Scheme,
        false
      );
    } else if (network === Network.REGTEST) {
      this.isCluster = false;
      //
      this.electrum = new ElectrumClient(
        "mainnet",
        "1.4.1",
        "127.0.0.1",
        60003,
        "ws"
      );
    } else {
      throw new Error(
        `Tried to instantiate an ElectrumNetworkProvider for unknown network: ${network}`
      );
    }
  }

  async getUtxos(address: string): Promise<Utxo[]> {
    const result = (await this.performRequest(
      "blockchain.address.listunspent",
      address
    )) as ElectrumUtxo[];

    const utxos = result.map((utxo) => ({
      txid: utxo.tx_hash,
      vout: utxo.tx_pos,
      satoshis: utxo.value,
      height: utxo.height,
    }));

    return utxos;
  }

  async getBlockHeight(): Promise<number> {
    const { height } = (await this.performRequest(
      "blockchain.headers.subscribe"
    )) as BlockHeader;

    return height;
  }

  async getRawTransaction(txid: string): Promise<string> {
    return (await this.performRequest(
      "blockchain.transaction.get",
      txid
    )) as string;
  }

  async sendRawTransaction(txHex: string): Promise<string> {
    return (await this.performRequest(
      "blockchain.transaction.broadcast",
      txHex
    )) as string;
  }

  async connectCluster(): Promise<boolean[]> {
    try {
      return await (this.electrum as ElectrumCluster).startup();
    } catch (e) {
      return [];
    }
  }
  async connectClient(): Promise<boolean[]> {
    try {
      return [await (this.electrum as ElectrumClient).connect()];
    } catch (e) {
      return [];
    }
  }

  async disconnectCluster(): Promise<boolean[]> {
    try {
      return await (this.electrum as ElectrumCluster).shutdown();
    } catch (e) {
      return [];
    }
  }

  async disconnectClient(): Promise<boolean[]> {
    try {
      return [await (this.electrum as ElectrumClient).disconnect()];
    } catch (e) {
      return [];
    }
  }

  private async performRequest(
    name: string,
    ...parameters: (string | number | boolean)[]
  ): Promise<RequestResponse> {
    // Only connect the cluster when no concurrent requests are running
    if (this.shouldConnect()) {
      if (this.isCluster) {
        this.connectCluster();
      } else {
        await this.connectClient();
      }
    }

    this.concurrentRequests += 1;

    if (this.isCluster) {
      await (this.electrum as ElectrumCluster).ready();
    }

    let result;
    try {
      result = await this.electrum.request(name, ...parameters);
    } finally {
      // Always disconnect the cluster, also if the request fails
      if (this.shouldDisconnect()) {
        if (this.isCluster) {
          await this.disconnectCluster();
        } else {
          await this.disconnectClient();
        }
      }
    }

    this.concurrentRequests -= 1;

    if (result instanceof Error) throw result;

    return result;
  }

  private shouldConnect(): boolean {
    if (this.manualConnectionManagement) return false;
    if (this.concurrentRequests !== 0) return false;
    return true;
  }

  private shouldDisconnect(): boolean {
    if (this.manualConnectionManagement) return false;
    if (this.concurrentRequests !== 1) return false;
    return true;
  }
}

interface ElectrumUtxo {
  tx_pos: number;
  value: number;
  tx_hash: string;
  height: number;
}

interface BlockHeader {
  height: number;
  hex: string;
}




// Unstable?
import {
    authenticationTemplateP2pkhNonHd,
    authenticationTemplateToCompilerBCH,
    bigIntToBinUint64LE,
    cashAddressToLockingBytecode,
    generateTransaction,
    InputTemplate,
    validateAuthenticationTemplate,
} from "@bitauth/libauth";

import {SendRequest} from "../wallet/Base"
import { UnspentOutput } from "grpc-bchrpc-node/pb/bchrpc_pb";

// Build a transaction for a p2pkh transaction for a non HD wallet
export async function buildP2pkhNonHdTransaction(
    inputs: UnspentOutput[],
    output: SendRequest,
    signingKey: Uint8Array
) {
    const template = validateAuthenticationTemplate(
        authenticationTemplateP2pkhNonHd
    );

    if (typeof template === "string") {
        throw new Error("Transaction template error");
    }

    const compiler = await authenticationTemplateToCompilerBCH(template);
    const amount = output.amount.inSatoshi();

    let signedInputs:any  = []
    for(const i of inputs){
        const utxoTxnValue = i.getValue();
        const utxoIndex = i.getOutpoint()?.getIndex();
        const utxoOutpointTransactionHash = i
            .getOutpoint()
            ?.getHash_asU8()
            .reverse();
        if (!utxoOutpointTransactionHash || utxoIndex === undefined) {
            throw new Error("Missing unspent outpoint when building transaction");
        }
        let newInput = {
            outpointIndex: utxoIndex,
            outpointTransactionHash: utxoOutpointTransactionHash,
            sequenceNumber: 0,
            unlockingBytecode: {
                compiler,
                data: {
                    keys: { privateKeys: { key: signingKey } },
                },
                satoshis: bigIntToBinUint64LE(BigInt(utxoTxnValue)),
                script: "unlock",
            },
        } 
        signedInputs.push(newInput)
    }

    
    const changeAmount = (await getInputTotal(inputs)) - (amount as number);

    if (!signingKey) {
        throw new Error("Missing signing key when building transaction");
    }


    try {
        let outputLockingBytecode = cashAddressToLockingBytecode(output.address);

        if (
            !outputLockingBytecode.hasOwnProperty("bytecode") ||
            !outputLockingBytecode.hasOwnProperty("prefix")
        ) {
            throw new Error(outputLockingBytecode.toString());
        }
        outputLockingBytecode = outputLockingBytecode as {
            bytecode: Uint8Array;
            prefix: string;
        };

        // Get the change locking bytecode
        let changeLockingBytecode = compiler.generateBytecode("lock", {
            keys: { privateKeys: { key: signingKey } },
        });
        if (!changeLockingBytecode.success) {
            throw new Error(changeLockingBytecode.toString());
        }

        const result = generateTransaction({
            inputs: signedInputs,
            locktime: 0,
            outputs: [
                {
                    lockingBytecode: outputLockingBytecode.bytecode,
                    satoshis: bigIntToBinUint64LE(BigInt(output.amount.inSatoshi())),
                },
                {
                    lockingBytecode: changeLockingBytecode.bytecode,
                    satoshis: bigIntToBinUint64LE(BigInt(changeAmount)),
                },
            ],
            version: 2,
        });
        return result;
    } catch (error) {
        throw Error(error.toString());
    }
}

export  async  function getSuitableUtxos(unspentOutputs: UnspentOutput[], amount: number, bestHeight: number) {
    let suitableUtxos: UnspentOutput[] = []
    let neededAmount = 0
    for (const u of unspentOutputs) {
        if (u.getIsCoinbase() && bestHeight) {
            let age = bestHeight - u.getBlockHeight() 
            if (age > 100) {
                suitableUtxos.push(u)
                neededAmount += u.getValue()
            }
        } else {
            suitableUtxos.push(u)
            neededAmount += u.getValue()
        }
        if (neededAmount > amount) {
            break;
        }
    }
    if (neededAmount > amount) {
        return suitableUtxos
    } else {
        throw Error("Could not find suitable outpoints for given amount")
    }
}


// Gets balance by summing value in all utxos in stats
export async function getInputTotal(inputs: UnspentOutput[]): Promise<number> {
 
    if (inputs) {
        const balanceArray: number[] = await Promise.all(
            inputs.map(async (o: UnspentOutput) => {
                return o.getValue();
            })
        );
        const balance = balanceArray.reduce((a: number, b: number) => a + b, 0);
        return balance;
    } else {
        return 0;
    }
}
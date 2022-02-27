import { IpcMain } from "electron"
import Store from 'electron-store'
import base58 from 'bs58'
import { Keypair } from "@solana/web3.js"
import { IPC_SOLANA_GET_WALLET, IPC_SOLANA_ON_WALLET_CHANGE, IPC_SOLANA_SET_WALLET } from "../../ipc/channels"

const STORE_PRIVATE_KEY = 'STORE_PRIVATE_KEY'
const store = new Store()

function initMain(ipcMain: IpcMain) {
    ipcMain.on(IPC_SOLANA_SET_WALLET, async (event, { privateKey }) => {
        store.set(STORE_PRIVATE_KEY, privateKey)
        event.reply(IPC_SOLANA_ON_WALLET_CHANGE, getAccount())
    })
    ipcMain.on(IPC_SOLANA_GET_WALLET, async (event) => {
        event.returnValue = getAccount()
    })
}

export default {
    initMain,
}

function getAccount(): string {
    const pk = store.get(STORE_PRIVATE_KEY) as string
    const kp = Keypair.fromSecretKey(base58.decode(pk))
    return kp.publicKey.toBase58()
}
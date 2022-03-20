import { IpcMain } from 'electron'
import Store from 'electron-store'
import base58 from 'bs58'
import { Keypair } from '@solana/web3.js'
import { IPC_SOLANA_GET_WALLET, IPC_SOLANA_ON_WALLET_CHANGE, IPC_SOLANA_SET_WALLET } from '../../ipc/channels'

const STORE_PRIVATE_KEY = 'STORE_PRIVATE_KEY'
const store = new Store()

export function getPrivateKey() {
  return store.get(STORE_PRIVATE_KEY) as string | undefined
}

export function getKeypair() {
  const pk = getPrivateKey()
  if (!pk) {
    return undefined
  }
  return Keypair.fromSecretKey(base58.decode(pk))
}

export function mustGetKeypair() {
  const keypair = getKeypair()
  if (!keypair) throw new Error('not found keypair')
  return keypair
}

export function getAccount() {
  const pk = getPrivateKey()
  if (!pk) {
    return undefined
  }
  const kp = Keypair.fromSecretKey(base58.decode(pk))
  return kp.publicKey.toBase58()
}

function initMain(ipcMain: IpcMain) {
  ipcMain.on(IPC_SOLANA_SET_WALLET, async (event, { privateKey }) => {
    store.set(STORE_PRIVATE_KEY, privateKey)
    event.reply(IPC_SOLANA_ON_WALLET_CHANGE, getAccount())
  })
  ipcMain.on(IPC_SOLANA_GET_WALLET, async (event, _) => {
    event.returnValue = getAccount()
  })
}

export default {
  initMain,
}

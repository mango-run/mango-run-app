import { IpcMain } from "electron"
import Store from 'electron-store'
import { IPC_STORE_GET, IPC_STORE_SET } from "../../ipc/channels"

function initMain(ipcMain: IpcMain) {
    const store = new Store()
    ipcMain.on(IPC_STORE_GET, async (event, value) => {
        event.returnValue = store.get(value)
    })
    ipcMain.on(IPC_STORE_SET, async (_, key, value) => {
        store.set(key, value)
    })
}

export default {
    initMain,
}
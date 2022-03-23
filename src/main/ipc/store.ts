import { IpcMain } from 'electron'
import Store from 'electron-store'
import { IPC_STORE_GET, IPC_STORE_SET } from '../../ipc/channels'

function initMain(ipcMain: IpcMain) {
  const store = new Store()
  ipcMain.on(IPC_STORE_GET, async (event, key) => {
    event.returnValue = store.get(key)
  })
  ipcMain.on(IPC_STORE_SET, async (_, { key, value }: { key: string; value: string }) => {
    if (value === undefined || value === null) {
      store.delete(key)
    } else {
      store.set(key, value)
    }
  })
}

export default {
  initMain,
}

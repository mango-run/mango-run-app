// stoe in local storage
export const IPC_STORE_GET = 'IPC_STORE_GET'
export const IPC_STORE_SET = 'IPC_STORE_SET'

// solana connect wallet and get wallet
// cannot use IPC_STORE_XXX directly as we need native modules to load private key
export const IPC_SOLANA_SET_WALLET = 'IPC_SOLANA_SET_WALLET'
export const IPC_SOLANA_GET_WALLET = 'IPC_SOLANA_GET_WALLET'
export const IPC_SOLANA_ON_WALLET_CHANGE = 'IPC_SOLANA_ON_WALLET_CHANGE'

// mango bot
export const IPC_MANGO_RUN_CHANNEL = 'IPC_MANGO_RUN_CHANNEL'

export type NetworkConfig = {
  name: string
  rpcUrl: string
  chainId?: number
  explorer?: string
}

type AppConfig = {
  appName: string
  apiBaseUrl: string
  billingContract: string
  network: NetworkConfig
}

const env = process.env

export const appConfig: AppConfig = {
  appName: "Harpocrates",
  apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL ?? "",
  billingContract: env.NEXT_PUBLIC_BILLING_CONTRACT ?? "",
  network: {
    name: "Horizen L3",
    rpcUrl: env.NEXT_PUBLIC_HORIZEN_L3_RPC_URL ?? "",
    chainId: Number(env.NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID ?? "0") || undefined,
    explorer: env.NEXT_PUBLIC_HORIZEN_L3_EXPLORER ?? "",
  },
}

export const envStatus = [
  { key: "NEXT_PUBLIC_API_BASE_URL", present: Boolean(env.NEXT_PUBLIC_API_BASE_URL) },
  { key: "NEXT_PUBLIC_BILLING_CONTRACT", present: Boolean(env.NEXT_PUBLIC_BILLING_CONTRACT) },
  { key: "NEXT_PUBLIC_HORIZEN_L3_RPC_URL", present: Boolean(env.NEXT_PUBLIC_HORIZEN_L3_RPC_URL) },
  { key: "NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID", present: Boolean(env.NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID) },
  { key: "NEXT_PUBLIC_HORIZEN_L3_EXPLORER", present: Boolean(env.NEXT_PUBLIC_HORIZEN_L3_EXPLORER) },
]

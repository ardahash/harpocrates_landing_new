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
  demo: {
    userAddress: string
    modelId: string
    inputTokens: string
    outputTokens: string
  }
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
  demo: {
    userAddress: env.NEXT_PUBLIC_DEMO_USER_ADDRESS ?? "",
    modelId: env.NEXT_PUBLIC_DEMO_MODEL_ID ?? "llm-secure-7b",
    inputTokens: env.NEXT_PUBLIC_DEMO_INPUT_TOKENS ?? "120",
    outputTokens: env.NEXT_PUBLIC_DEMO_OUTPUT_TOKENS ?? "80",
  },
}

export const envStatus = [
  { key: "NEXT_PUBLIC_API_BASE_URL", present: Boolean(env.NEXT_PUBLIC_API_BASE_URL) },
  { key: "NEXT_PUBLIC_BILLING_CONTRACT", present: Boolean(env.NEXT_PUBLIC_BILLING_CONTRACT) },
  { key: "NEXT_PUBLIC_HORIZEN_L3_RPC_URL", present: Boolean(env.NEXT_PUBLIC_HORIZEN_L3_RPC_URL) },
  { key: "NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID", present: Boolean(env.NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID) },
  { key: "NEXT_PUBLIC_HORIZEN_L3_EXPLORER", present: Boolean(env.NEXT_PUBLIC_HORIZEN_L3_EXPLORER) },
]

export function getRuntimeConfig(): AppConfig {
  const runtimeEnv = process.env
  return {
    appName: "Harpocrates",
    apiBaseUrl: runtimeEnv.NEXT_PUBLIC_API_BASE_URL ?? "",
    billingContract: runtimeEnv.NEXT_PUBLIC_BILLING_CONTRACT ?? "",
    network: {
      name: "Horizen L3",
      rpcUrl: runtimeEnv.NEXT_PUBLIC_HORIZEN_L3_RPC_URL ?? "",
      chainId: Number(runtimeEnv.NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID ?? "0") || undefined,
      explorer: runtimeEnv.NEXT_PUBLIC_HORIZEN_L3_EXPLORER ?? "",
    },
    demo: {
      userAddress: runtimeEnv.NEXT_PUBLIC_DEMO_USER_ADDRESS ?? "",
      modelId: runtimeEnv.NEXT_PUBLIC_DEMO_MODEL_ID ?? "llm-secure-7b",
      inputTokens: runtimeEnv.NEXT_PUBLIC_DEMO_INPUT_TOKENS ?? "120",
      outputTokens: runtimeEnv.NEXT_PUBLIC_DEMO_OUTPUT_TOKENS ?? "80",
    },
  }
}

export function getRuntimeEnvStatus() {
  const runtimeEnv = process.env
  return [
    { key: "NEXT_PUBLIC_API_BASE_URL", present: Boolean(runtimeEnv.NEXT_PUBLIC_API_BASE_URL) },
    { key: "NEXT_PUBLIC_BILLING_CONTRACT", present: Boolean(runtimeEnv.NEXT_PUBLIC_BILLING_CONTRACT) },
    { key: "NEXT_PUBLIC_HORIZEN_L3_RPC_URL", present: Boolean(runtimeEnv.NEXT_PUBLIC_HORIZEN_L3_RPC_URL) },
    { key: "NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID", present: Boolean(runtimeEnv.NEXT_PUBLIC_HORIZEN_L3_CHAIN_ID) },
    { key: "NEXT_PUBLIC_HORIZEN_L3_EXPLORER", present: Boolean(runtimeEnv.NEXT_PUBLIC_HORIZEN_L3_EXPLORER) },
  ]
}

export type Service = {
  id: string
  name: string
  url: string

  status: "UP" | "DOWN" | "UNKNOWN"

  version?: string
  last_deployed?: Date

  // 🔥 monitoring
  last_checked?: Date
  response_time?: number

  // 🔥 SRE (failure simulation)
  manual_override?: boolean
  override_until?: Date | null
}
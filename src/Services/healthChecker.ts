import axios from "axios"
import { getServices, updateServiceStatus } from "./serviceRegistry"

const INTERVAL = 10000

export async function checkHealth(url: string) {

  const start = Date.now()

  try {

    const response = await axios.get(`${url}/health`, {
      timeout: 5000
    })

    const responseTime = Date.now() - start

    return {
      status: "UP",
      statusCode: response.status,
      responseTime
    }

  } catch {

    return {
      status: "DOWN"
    }

  }
}

export function startHealthChecker() {

  console.log("Health checker started")

  setInterval(async () => {

    const services = await getServices()

    for (const service of services) {

      const result = await checkHealth(service.url)

      if (result.status === "DOWN") {

        console.log(`Service ${service.name} is DOWN`)

        await updateServiceStatus(service.id, "DOWN")

      } else {

        console.log(`Service ${service.name} is UP`)

        await updateServiceStatus(service.id, "UP")

      }

    }

  }, INTERVAL)

}
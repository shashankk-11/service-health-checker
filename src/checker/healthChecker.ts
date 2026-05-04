import axios from "axios";
import { getServices } from "../Services/serviceRegistry";

// 🔍 Single health check
export async function checkHealth(url: string) {
  const start = Date.now();

  try {
    const response = await axios.get(`${url}/health`, {
      timeout: 5000,
    });

    return {
      status: "UP",
      statusCode: response.status,
      responseTime: Date.now() - start,
    };
  } catch {
    return {
      status: "DOWN",
    };
  }
}

// 🔹 Manual run (API usage)
export async function runHealthCheckOnce() {
  const services = await getServices();

  return Promise.all(
    services.map(async (service) => {
      const result = await checkHealth(service.url);

      return {
        service: service.name,
        url: service.url,
        ...result,
        timestamp: new Date().toISOString(),
      };
    }),
  );
}

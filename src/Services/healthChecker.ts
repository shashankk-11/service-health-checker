import axios from "axios";
import client from "prom-client";
import { getServices, updateServiceStatus } from "./serviceRegistry";

const INTERVAL = 10000;

let intervalRef: NodeJS.Timeout | null = null;

// 🔥 Prometheus Metrics
const healthCheckCounter = new client.Counter({
  name: "health_checks_total",
  help: "Total health checks performed",
});

const failureCounter = new client.Counter({
  name: "health_check_failures_total",
  help: "Total failed health checks",
});

// Collect default system metrics
client.collectDefaultMetrics();

// 🔍 Health Check Function
export async function checkHealth(url: string) {
  const start = Date.now();

  try {
    const response = await axios.get(`${url}/health`, {
      timeout: 5000,
    });

    const responseTime = Date.now() - start;

    return {
      status: "UP",
      statusCode: response.status,
      responseTime,
    };
  } catch {
    return {
      status: "DOWN",
    };
  }
}

// 🚀 Start Health Checker
export function startHealthChecker() {
  if (intervalRef) {
    console.log("Health checker already running");
    return;
  }

  console.log("Health checker started");

  intervalRef = setInterval(async () => {
    const services = await getServices();

    await Promise.all(
      services.map(async (service) => {
        try {
          const result = await checkHealth(service.url);

          healthCheckCounter.inc();

          if (result.status === "DOWN") {
            failureCounter.inc();
          }

          const logPayload = {
            event: "health_check",
            service: service.name,
            status: result.status,
            responseTime: result.responseTime ?? null,
            timestamp: new Date().toISOString(),
          };

          console.log(JSON.stringify(logPayload));

          await updateServiceStatus(service.id, result.status);
        } catch (err) {
          console.error(
            JSON.stringify({
              event: "health_check_error",
              service: service.name,
              error: String(err),
              timestamp: new Date().toISOString(),
            }),
          );
        }
      }),
    );
  }, INTERVAL);
}

// 🛑 Stop Health Checker
export function stopHealthChecker() {
  if (!intervalRef) {
    console.log("Health checker is not running");
    return;
  }

  clearInterval(intervalRef);
  intervalRef = null;

  console.log("Health checker stopped");
}

// 🔹 Run health check once (for API usage)
export async function runHealthCheckOnce() {
  const services = await getServices();

  const results = await Promise.all(
    services.map(async (service) => {
      try {
        const result = await checkHealth(service.url);

        return {
          service: service.name,
          url: service.url,
          status: result.status,
          responseTime: result.responseTime ?? null,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        return {
          service: service.name,
          url: service.url,
          status: "ERROR",
          error: String(err),
          timestamp: new Date().toISOString(),
        };
      }
    }),
  );

  return results;
}

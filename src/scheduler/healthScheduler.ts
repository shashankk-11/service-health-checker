import client from "prom-client";
import { checkHealth } from "../checker/healthChecker";
import { getServices, updateServiceStatus } from "../Services/serviceRegistry";

const INTERVAL = 10000;

let intervalRef: NodeJS.Timeout | null = null;

// 🔥 Metrics
const healthCheckCounter = new client.Counter({
  name: "health_checks_total",
  help: "Total health checks performed",
});

const failureCounter = new client.Counter({
  name: "health_check_failures_total",
  help: "Total failed health checks",
});

client.collectDefaultMetrics();

// 🚀 Start scheduler
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
          if (service.manual_override) {
            console.log(`Skipping ${service.name} (manual override)`);
            return;
          }

          const result = await checkHealth(service.url);

          healthCheckCounter.inc();

          if (result.status === "DOWN") {
            failureCounter.inc();
          }

          console.log(
            JSON.stringify({
              event: "health_check",
              service: service.name,
              status: result.status,
              responseTime: result.responseTime ?? null,
              timestamp: new Date().toISOString(),
            }),
          );

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

// 🛑 Stop scheduler
export function stopHealthChecker() {
  if (!intervalRef) {
    console.log("Health checker is not running");
    return;
  }

  clearInterval(intervalRef);
  intervalRef = null;

  console.log("Health checker stopped");
}

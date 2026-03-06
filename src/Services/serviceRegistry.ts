type Service = {
  id: number
  name: string
  url: string
}

const services: Service[] = []

export function addService(name: string, url: string) {
  const service = {
    id: services.length + 1,
    name,
    url
  }

  services.push(service)

  return service
}

export function getServices() {
  return services
}
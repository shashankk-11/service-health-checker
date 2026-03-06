import { pool } from "../db/database"
import type { Service } from "../types/Service"

export async function addService(name: string, url: string): Promise<Service> {

  const result = await pool.query(
    "INSERT INTO services(name, url) VALUES($1,$2) RETURNING *",
    [name, url]
  )

  return result.rows[0]
}

export async function getServices(): Promise<Service[]> {

  const result = await pool.query("SELECT * FROM services")

  return result.rows
}

export async function updateServiceStatus(
  id: number,
  status: string
): Promise<void> {

  await pool.query(
    `UPDATE services
     SET status = $1
     WHERE id = $2`,
    [status, id]
  )

}

// export async function removeService(id: number): Promise<void> {

//   await pool.query(
//     "DELETE FROM services WHERE id = $1",
//     [id]
//   )

// }
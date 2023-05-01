import { ArrayElement } from './utils/elements'
import * as fs from 'node:fs/promises'

interface TaskDatabaseTable {
  id: string
  title: string
  description: string
  completed_at: Date | null
  created_at: Date
  updated_at: Date | null
}

interface DatabaseProps {
  tasks: Array<TaskDatabaseTable>
}
const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {} as DatabaseProps

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }

  select(table: keyof DatabaseProps, search: {} | null) {
    let data = this.#database[table] ?? []
    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) {
            return true
          }

          return row[key] === value
        })
      })
    }
    return data
  }
  insert<K extends keyof DatabaseProps>(
    table: K,
    data: ArrayElement<DatabaseProps[K]>
  ) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()

    return data
  }
  update(table: keyof DatabaseProps, id: string, data: {}) {
    const findRowIndex = this.#database[table].findIndex((row) => row.id === id)
    if (findRowIndex > -1) {
      const row = this.#database[table][findRowIndex]
      this.#database[table][findRowIndex] = { id, ...row, ...data }

      this.#persist()
    }
  }

  delete(table: keyof DatabaseProps, id: string) {
    const findRowIndex = this.#database[table].findIndex((row) => row.id === id)
    if (findRowIndex > -1) {
      this.#database[table].splice(findRowIndex, 1)
      this.#persist()
    }
  }
}

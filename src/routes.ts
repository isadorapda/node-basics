import { randomUUID } from 'crypto'
import { Database } from './database'
import { createPath } from './utils/createPath'

const database = new Database()
export const routes = [
  {
    method: 'GET',
    path: createPath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null
      )
      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: createPath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'Title is required.' }))
      }
      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'The task description is required.' }))
      }
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
      database.insert('tasks', task)
      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: createPath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: 'Title and description are required' })
          )
      }

      //   const [task] = database.select('tasks', { id })

      //   if (!task) {
      //     return res.writeHead(404).end()
      //   }
      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date(),
      })
      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: createPath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      //   const [task] = database.select('tasks', { id })
      //   if (!task) {
      //     return res.writeHead(404).end()
      //   }
      database.delete('tasks', id)
      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: createPath('/tasks/:id/completed'),
    handler: (req, res) => {
      const { id } = req.params
      const [task] = database.select('tasks', { id })
      if (!task) {
        return res.writeHead(404).end()
      }
      const isTaskCompleted = !!task.completed_at
      const completed_at = isTaskCompleted ? null : new Date()

      database.update('tasks', id, { completed_at })
      return res.writeHead(204).end()
    },
  },
]

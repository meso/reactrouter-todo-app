import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'todos.db');
export const db = new Database(dbPath);

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const todoQueries = {
  getAll: db.prepare('SELECT id, title, completed, created_at as createdAt FROM todos ORDER BY created_at DESC'),
  getById: db.prepare('SELECT id, title, completed, created_at as createdAt FROM todos WHERE id = ?'),
  create: db.prepare('INSERT INTO todos (title) VALUES (?)'),
  update: db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM todos WHERE id = ?'),
  toggleComplete: db.prepare('UPDATE todos SET completed = NOT completed WHERE id = ?')
};
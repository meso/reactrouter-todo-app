import { data, redirect } from "react-router";
import { todoQueries, type Todo } from "~/lib/db";

export async function loader() {
  const todos = todoQueries.getAll.all() as Todo[];
  return { todos };
}


export default function Todos({ loaderData }: { loaderData: { todos: Todo[] } }) {
  const { todos } = loaderData;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">ToDo アプリ</h1>
      
      <form method="post" className="mb-8">
        <input type="hidden" name="intent" value="create" />
        <div className="flex gap-2">
          <input
            type="text"
            name="title"
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            追加
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">タスクがありません</p>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500 text-center">
        {todos.length} 個のタスク
        {todos.filter(t => t.completed).length > 0 && 
          ` (${todos.filter(t => t.completed).length} 個完了)`
        }
      </div>
    </div>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div className={`flex items-center gap-3 p-4 border rounded-lg ${
      todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
    }`}>
      <form method="post" className="contents">
        <input type="hidden" name="intent" value="toggle" />
        <input type="hidden" name="id" value={todo.id} />
        <button
          type="submit"
          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            todo.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </form>
      
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
        {todo.title}
      </span>
      
      <span className="text-xs text-gray-400">
        {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
      </span>
      
      <form method="post" className="contents">
        <input type="hidden" name="intent" value="delete" />
        <input type="hidden" name="id" value={todo.id} />
        <button
          type="submit"
          className="text-red-500 hover:text-red-700 p-1"
          onClick={(e) => {
            if (!confirm('このタスクを削除しますか？')) {
              e.preventDefault();
            }
          }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
}
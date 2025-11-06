import { useEffect, useMemo, useState } from 'react';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './api/todos.js';

const initialFormState = {
  title: '',
  dueDate: ''
};

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load todos. Make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Please add a title before creating a todo.');
      return;
    }

    try {
      setError('');
      const newTodo = await createTodo({
        title: form.title,
        dueDate: form.dueDate || undefined
      });
      setTodos((prev) => [newTodo, ...prev]);
      setForm(initialFormState);
    } catch (err) {
      console.error(err);
      setError('Unable to create todo. Check server logs for more info.');
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const updated = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos((prev) => prev.map((item) => (item._id === todo._id ? updated : item)));
    } catch (err) {
      console.error(err);
      setError('Unable to update todo.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this todo?')) return;

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
      setError('Unable to delete todo.');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>MERN Todo App</h1>
      </header>

      <section className="card">
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label htmlFor="title">What needs to be done?</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Finish MERN stack project"
              value={form.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due date (optional)</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="primary">
            Add Todo
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <div className="toolbar">
          <p>{todos.length} total</p>
          <div className="filters">
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading todos...</p>
        ) : filteredTodos.length === 0 ? (
          <p>No todos yet. Create one above!</p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo._id} className={todo.completed ? 'completed' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />
                  <div>
                    <p className="title">{todo.title}</p>
                    {todo.dueDate && (
                      <p className="meta">
                        Due {new Date(todo.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </label>
                <button type="button" className="danger" onClick={() => handleDelete(todo._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

export const fetchTodos = async () => {
  const { data } = await api.get('/todos');
  return data;
};

export const createTodo = async (payload) => {
  const { data } = await api.post('/todos', payload);
  return data;
};

export const updateTodo = async (id, payload) => {
  const { data } = await api.patch(`/todos/${id}`, payload);
  return data;
};

export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`);
};

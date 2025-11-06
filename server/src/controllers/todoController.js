import { Todo } from '../models/Todo.js';

export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { title, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const todo = await Todo.create({
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, completed, dueDate } = req.body;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    if (title !== undefined) {
      const trimmed = title.trim();
      if (!trimmed) {
        return res.status(400).json({ message: 'Title cannot be empty.' });
      }
      todo.title = trimmed;
    }

    if (completed !== undefined) {
      todo.completed = Boolean(completed);
    }

    if (dueDate !== undefined) {
      todo.dueDate = dueDate ? new Date(dueDate) : undefined;
    }

    const updated = await todo.save();

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

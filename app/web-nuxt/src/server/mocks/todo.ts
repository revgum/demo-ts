import type { Todo } from '../types';

export const buildTodos = (values: Partial<Todo>, count = 1): Todo[] => {
  const todos: Todo[] = [];
  for (let index = 0; index < count; index++) {
    todos.push({
      completed: values.completed || false,
      created_at: values.created_at || new Date().toISOString(),
      id: values.id || crypto.randomUUID(),
      title: values.title || `Mocked task ${index}`,
      deleted_at: values.deleted_at,
      updated_at: values.updated_at,
      due_at: values.due_at,
    });
  }

  return todos;
};

const todos = buildTodos({}, 4);
let _mockTodos = [...todos];

export const getById = (id: Todo['id']) => {
  return _mockTodos.filter((t) => t.id === id)[0];
};

export const getAll = () => {
  return _mockTodos;
};

export const create = (data: Partial<Todo>) => {
  const newTodo = buildTodos({ ...data }, 1)[0];
  _mockTodos.push(newTodo);
  return newTodo;
};

export const deleteById = (id: Todo['id']) => {
  _mockTodos = _mockTodos.filter((t) => t.id !== id);
  return buildTodos({ id }, 1)[0];
};

export const updateById = (id: Todo['id'], data: Partial<Todo>) => {
  const todoIndex = _mockTodos.findIndex((t) => t.id === id);
  const foundTodo = _mockTodos.find((t) => t.id === id);
  _mockTodos[todoIndex] = { ...foundTodo, ...data, id } as Todo;
  return _mockTodos[todoIndex];
};

export const reset = () => {
  _mockTodos = { ...todos };
};

export default buildTodos;

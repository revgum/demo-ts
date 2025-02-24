import type { Todo } from '../types';

export default (values: Partial<Todo>, count = 1): Todo[] => {
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

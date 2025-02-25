export const APIS = {
  TodoGetAll: () => 'api/todos',
  TodoGetById: (id: string) => `api/todos/${id}`,
  TodoCreate: () => 'api/todos',
  TodoUpdate: (id: string) => `api/todos/${id}`,
  TodoDelete: (id: string) => `api/todos/${id}`,
};

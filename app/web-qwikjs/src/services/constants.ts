export const METHODS = {
  TodoGetAll: () => '/api/v1/todos',
  TodoCreate: () => '/api/v1/todos',
  TodoGetById: (id: string) => `/api/v1/todos/${id}`,
  TodoUpdateById: (id: string) => `/api/v1/todos/${id}`,
  TodoDeleteById: (id: string) => `/api/v1/todos/${id}`,
} as const;

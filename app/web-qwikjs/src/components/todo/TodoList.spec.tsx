import { randomUUID } from 'node:crypto';
import { createDOM } from '@builder.io/qwik/testing';
import { type Mocked, beforeEach, describe, expect, it, vi } from 'vitest';
import * as TodoLayout from '~/routes/todos/layout';
import type { Todo } from '~/types';
import TodoList from './TodoList';

vi.mock('~/routes/todos/layout');
vi.mock('~/components/todo/TodoForm');

vi.mock('@modular-forms/qwik', () => {
  return {
    formActionQrl: vi.fn(),
    zodFormQrl: vi.fn(),
  };
});

describe('Component: TodoList', () => {
  const mockTodos: Todo[] = [
    { id: randomUUID(), title: 'Buy groceries', completed: false, created_at: new Date().toISOString() },
    { id: randomUUID(), title: 'Walk the dog', completed: false, created_at: new Date().toISOString() },
    { id: randomUUID(), title: 'Paint a masterpiece', completed: true, created_at: new Date().toISOString() },
  ];

  let mockTodoLayout: Mocked<typeof TodoLayout>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTodoLayout = TodoLayout as Mocked<typeof TodoLayout>;
    mockTodoLayout.useTodos.mockReturnValue({
      value: [],
    });
  });

  it('renders a message when there are no todos', async () => {
    const { screen, render } = await createDOM();
    await render(<TodoList />);
    expect(screen.outerHTML).toContain('No todos found, add a new todo.');
  });

  it('renders a list of todos', async () => {
    mockTodoLayout.useTodos.mockReturnValue({
      value: mockTodos.slice(0, 2),
    });
    const { screen, render } = await createDOM();
    await render(<TodoList />);
    expect(screen.outerHTML).toContain('Buy groceries');
    expect(screen.outerHTML).toContain('Walk the dog');
  });

  it('renders <hr> separators except for the last one', async () => {
    mockTodoLayout.useTodos.mockReturnValue({
      value: mockTodos,
    });
    const { screen, render } = await createDOM();
    await render(<TodoList />);

    expect(screen.querySelectorAll('hr')).toHaveLength(2);
  });
});

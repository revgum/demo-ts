import { randomUUID } from 'node:crypto';
import { createDOM } from '@builder.io/qwik/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Todo } from '~/types';
import TodoItem from './TodoItem';

vi.mock('~/routes/todos/layout');
vi.mock('~/components/todo/TodoForm');

vi.mock('@modular-forms/qwik', () => {
  return {
    formActionQrl: vi.fn(),
    zodFormQrl: vi.fn(),
  };
});

describe('Component: TodoItem', () => {
  const mockTodos: Todo[] = [
    { id: randomUUID(), title: 'Buy groceries', completed: false, created_at: new Date().toISOString() },
    {
      id: randomUUID(),
      title: 'Walk the dog',
      completed: false,
      created_at: new Date().toISOString(),
      due_at: new Date().toISOString(),
    },
    { id: randomUUID(), title: 'Paint a masterpiece', completed: true, created_at: new Date().toISOString() },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a todo item without a due date', async () => {
    const { screen, render } = await createDOM();
    await render(<TodoItem todo={mockTodos[0]} />);
    expect(screen.outerHTML).toContain('Buy groceries');
    expect(screen.outerHTML).toContain('No due date');
  });

  it('renders a todo item with a due date', async () => {
    const { screen, render } = await createDOM();
    await render(<TodoItem todo={mockTodos[1]} />);
    expect(screen.outerHTML).toContain('Walk the dog');
    expect(screen.outerHTML).toContain(mockTodos[1].due_at?.substring(0, 10));
  });

  it('renders a hidden modal', async () => {
    const { screen, render } = await createDOM();
    await render(<TodoItem todo={mockTodos[0]} />);
    const modal = screen.querySelector('[data-testid="todo-modal"]');
    expect(modal).not.toBeNull();
    expect(modal?.outerHTML).toContain('Make changes to your todo');
    const form = modal?.querySelector('[data-testid="todo-form-wrapper"]');
    expect(form).not.toBeNull();
  });
});

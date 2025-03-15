import { randomUUID } from 'node:crypto';
import { createDOM } from '@builder.io/qwik/testing';
import { type Mocked, beforeEach, describe, expect, it, vi } from 'vitest';
import * as TodosLayout from '~/routes/todos/layout';
import type { Todo } from '~/types';
import TodoForm from './TodoForm';

vi.mock('~/routes/todos/layout');

describe('Component: TodoForm', () => {
  let mockTodosLayout: Mocked<typeof TodosLayout>;

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
    mockTodosLayout = TodosLayout as Mocked<typeof TodosLayout>;
    mockTodosLayout.useFormLoader.mockReturnValue({ value: { id: randomUUID(), title: 'Title', due_at: null } });
  });

  it('renders a todo item without a due date', async () => {
    const { screen, render } = await createDOM();
    await render(<TodoForm todo={mockTodos[0]} />);
    expect(screen.outerHTML).toContain('Buy groceries');
    const due_at = screen.querySelector('[name="due_at"]');
    expect(due_at?.getAttribute('value')).toBeNull();
  });

  it('renders a todo item with a due date', async () => {
    const { screen, render } = await createDOM();
    await render(<TodoForm todo={mockTodos[1]} />);
    expect(screen.outerHTML).toContain('Walk the dog');
    const due_at = screen.querySelector('[name="due_at"]');
    expect(due_at?.getAttribute('value')).toContain(mockTodos[1].due_at?.substring(0, 10));
  });

  it('renders an empty form', async () => {
    mockTodosLayout.useFormLoader.mockReturnValue({ value: { id: '', title: '', due_at: null } });
    const { screen, render } = await createDOM();
    await render(<TodoForm />);
    const due_at = screen.querySelector('[name="due_at"]');
    expect(due_at?.getAttribute('value')).toBeNull();
    const title = screen.querySelector('[name="title"]');
    console.log(title?.outerHTML);
    expect(title?.getAttribute('value')).toBe('');
  });
});

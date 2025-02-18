import { component$ } from '@builder.io/qwik';
import type { Todo } from '~/types';
import { LineMdCloseCircleFilled } from '../icons/Close';
import { LineMdSquareFilledToConfirmSquareFilledTransition } from '../icons/Confirm';

// TodoList renders a list of "todos" and has handle* methods for performing actions on an individual item
interface TodoListProps {
  todos: Todo[];
  handleToggle: (t: Todo) => void;
  handleDelete: (t: Todo) => void;
}

// TodoItem component has a single "todo" instead of "todos", otherwise includes the handle* methods.
type TodoItemProps = Omit<TodoListProps, 'todos'> & {
  todo: Todo;
};

const TodoItem = component$<TodoItemProps>(({ todo, handleDelete, handleToggle }) => {
  const getDate = () => {
    if (todo.completed && todo.updated_at) {
      return `Completed ${todo.updated_at.substring(0, 10)}`;
    }
    if (todo.due_at) {
      return `Due ${todo.due_at.substring(0, 10)}`;
    }
    return 'No due date.';
  };

  return (
    <div
      class={`flex items-center justify-between p-4 border-b last:border-none transition-opacity ${todo.completed ? 'opacity-50' : 'opacity-100'}`}
    >
      <div>
        <h3 class="text-lg font-medium">{todo.title}</h3>
        <p class="text-sm text-gray-500">{getDate()}</p>
      </div>
      <div class="relative inline-flex h-6 w-11 items-center text-2xl">
        <button
          type="button"
          onClick$={() => handleToggle(todo)}
          class={todo.completed ? 'text-green-500' : 'text-gray-300'}
        >
          <LineMdSquareFilledToConfirmSquareFilledTransition
            title={todo.completed ? 'Mark as todo' : 'Mark as complete'}
          />
        </button>
        <button type="button" onClick$={() => handleDelete(todo)} class="text-red-700 opacity-75 ml-2">
          <LineMdCloseCircleFilled title="Delete todo" />
        </button>
      </div>
    </div>
  );
});

// The "default" component exported is a list of Todos
export default component$<TodoListProps>((props) => {
  const { todos, ...rest } = props;
  return (
    <>
      {todos.length ? (
        todos.map((t) => <TodoItem key={t.id} todo={t} {...rest} />)
      ) : (
        <h3 class="text-lg font-medium text-slate-700">No tasks found, add a new task.</h3>
      )}
    </>
  );
});

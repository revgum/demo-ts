import { type Signal, component$ } from '@builder.io/qwik';
import { MatCancelFilled } from '@qwikest/icons/material';
import type { Todo } from '~/types';
import { Header, Modal } from '../ui/modal/modal';
import TodoForm from './TodoForm';

export default component$(({ show, todo }: { show: Signal<boolean>; todo: Todo }) => {
  return (
    <div data-testid="todo-modal">
      <Modal visible={show} header={<Header>Edit Todo</Header>}>
        <MatCancelFilled
          class="absolute top-3 right-3 h-6 w-6 text-red-500 cursor-pointer"
          onClick$={() => {
            show.value = false;
          }}
        />
        <p class="font-light text-sm text-gray-600">Make changes to your todo here. Click save when you're done.</p>
        <div data-testid="todo-form-wrapper">
          <TodoForm modalVisible={show} todo={todo} classList="mt-6" />
        </div>
      </Modal>
    </div>
  );
});

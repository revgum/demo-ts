import { type Signal, component$ } from '@builder.io/qwik';
import { cn } from '@qwik-ui/utils';
import { MatCancelFilled } from '@qwikest/icons/material';
import { Modal, buttonVariants } from '~/components/ui';
import type { Todo } from '~/types';
import TodoForm from './TodoForm';

export default component$(({ show, todo }: { show: Signal<boolean>; todo: Todo }) => {
  return (
    <Modal.Panel class="max-w-sm rounded-xl" data-testid="todo-modal">
      <Modal.Title>Edit Todo</Modal.Title>
      <Modal.Description>Make changes to your todo here. Click save when you're done.</Modal.Description>
      <div data-testid="todo-form-wrapper">
        <TodoForm modalVisible={show} todo={todo} classList="mt-6" />
      </div>
      <Modal.Close class={cn(buttonVariants({ size: 'icon', look: 'link' }), 'absolute right-3 top-2')} type="submit">
        <MatCancelFilled class="h-6 w-6 text-red-500" />
      </Modal.Close>
    </Modal.Panel>
  );
});

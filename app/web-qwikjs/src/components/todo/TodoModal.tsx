import { type Signal, component$ } from '@builder.io/qwik';
import { cn } from '@qwik-ui/utils';
import { LuX } from '@qwikest/icons/lucide';
import { Modal, buttonVariants } from '~/components/ui';
import type { Todo } from '~/types';
import TodoForm from './TodoForm';

// TODO: pass in Todo from clicking edit button on a todo item?
export default component$(({ show, todo }: { show: Signal<boolean>; todo: Todo }) => {
  return (
    <Modal.Panel class="rounded-xl">
      <Modal.Title>Edit Task</Modal.Title>
      <Modal.Description>
        Make changes to your task here. Click save when you're done.
      </Modal.Description>
      <TodoForm modalVisible={show} todo={todo} classList="mt-6" />
      <Modal.Close
        class={cn(
          buttonVariants({ size: 'icon', look: 'link' }),
          'absolute right-3 top-2',
        )}
        type="submit"
      >
        <LuX class="h-5 w-5" />
      </Modal.Close>
    </Modal.Panel>
  );
});

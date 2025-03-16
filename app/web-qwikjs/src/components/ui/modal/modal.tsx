import { type JSXOutput, type PropsOf, type Signal, Slot, component$ } from '@builder.io/qwik';
import cn from 'classnames';
import { Modal as FBModal } from 'flowbite-qwik';

export const Header = component$<PropsOf<'h2'>>(({ ...props }) => {
  return (
    <h2 {...props} class={cn('text-lg tracking-tight m-0', props.class)}>
      <Slot />
    </h2>
  );
});

export const Footer = component$<PropsOf<'div'>>(({ ...props }) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});

interface ModalProps {
  visible: Signal<boolean>;
  header: JSXOutput;
}
export const Modal = component$(({ visible, header }: ModalProps) => {
  return (
    <FBModal
      popup
      persistent
      size="md"
      theme={{
        backdrop: 'bg-black bg-opacity-60 backdrop-blur-sm',
        header: '!pt-6 !px-6',
        content: '!px-6 !pt-0',
      }}
      header={header}
      bind:show={visible}
    >
      <Slot />
    </FBModal>
  );
});

import { component$ } from '@builder.io/qwik';
import { MatCheckCircleFilled, MatErrorFilled, MatWarningFilled } from '@qwikest/icons/material';
import cn from 'classnames';

interface ToastProps {
  kind: 'empty' | 'success' | 'danger' | 'warning';
  message: string;
}

const ToastIcon = component$<Pick<ToastProps, 'kind'>>(({ kind }) => {
  switch (kind) {
    case 'success':
      return <MatCheckCircleFilled class="text-2xl" />;
    case 'danger':
      return <MatErrorFilled class="text-2xl" />;
    case 'warning':
      return <MatWarningFilled class="text-2xl" />;
    default:
      return null;
  }
});

export const Toast = component$<ToastProps>(({ kind, message }) => {
  const styles = {
    empty: {
      container: 'bg-gray-100 text-gray-500 border-gray-300',
      icon: 'text-gray-500',
    },
    success: {
      container: 'bg-green-100 text-green-500 border-green-300',
      icon: 'text-green-500',
    },
    danger: {
      container: 'bg-red-100 text-red-500 border-red-300',
      icon: 'text-red-500',
    },
    warning: {
      container: 'bg-yellow-100 text-yellow-500 border-yellow-300',
      icon: 'text=yellow-500',
    },
  };
  return (
    <div
      id={`toast-${kind}`}
      class={cn(
        'flex items-center w-full z-50 absolute top-[15px] max-w-xs p-4 mb-4 rounded-lg shadow-sm border border-2 shadow-md',
        styles[kind].container,
      )}
      role="alert"
    >
      <div class={cn('inline-flex items-center justify-center shrink-0', styles[kind].icon)}>
        <ToastIcon kind={kind} />
      </div>
      <div class="ms-3 font-normal">{message}</div>
    </div>
  );
});

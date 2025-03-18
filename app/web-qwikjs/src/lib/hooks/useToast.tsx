import {
  $,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useStore,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { Toast } from '~/components/ui/toast/toast';

interface ToastState {
  message: string;
  kind: 'success' | 'danger' | 'empty' | 'warning';
  visible: boolean;
  hideMs?: number; // Optional property to control auto-hide duration
}

interface ToastContext {
  showToast: (message: string, kind: ToastState['kind'], hideMs?: ToastState['hideMs']) => void;
  hideToast: () => void;
}

const ToastContextId = createContextId<ToastContext>('toast-context');

export const useToast = (): ToastContext => {
  return useContext(ToastContextId);
};

/*
 * The ToastProvider component manages the state of the toast notification
 * and provides methods to show and hide it. It uses Qwik's context API to
 * make the toast functionality available throughout the application.
 */
export const ToastProvider = component$(() => {
  const location = useLocation();
  const toast = useStore<ToastState>({
    message: '',
    kind: 'empty',
    visible: false,
  });

  // Hide the toast when the URL changes (e.g., navigating to a different page)
  useTask$(({ track }) => {
    track(() => location.url.pathname);
    toast.visible = false;
  });

  // Ensure the toast is hidden on initial render
  useVisibleTask$(() => {
    toast.visible = false;
  });

  const showToast = $((message: string, kind: ToastState['kind'], hideMs?: ToastState['hideMs']) => {
    toast.message = message;
    toast.kind = kind;
    toast.visible = true;
    toast.hideMs = hideMs;

    if (hideMs) {
      setTimeout(
        $(() => {
          toast.visible = false;
        }),
        hideMs,
      ); // Hide after 3 seconds
    }
  });

  const hideToast = $(() => {
    toast.visible = false;
  });

  useContextProvider(ToastContextId, { showToast, hideToast });

  return (
    <>
      {toast.visible && <Toast kind={toast.kind} message={toast.message} />}
      <Slot />
    </>
  );
});

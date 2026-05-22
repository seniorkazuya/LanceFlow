import type { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type AppRouter = ReturnType<typeof useRouter>;

export function notifySuccess(message: string): void {
  toast.success(message, { duration: 4000 });
}

export function notifyError(message: string): void {
  toast.error(message, { duration: 5000 });
}

export function notifyInfo(message: string): void {
  toast.info(message, { duration: 4000 });
}

/** Sonner action toast instead of `window.confirm`. */
export function confirmAction(
  message: string,
  onConfirm: () => void | Promise<void>,
  options?: { confirmLabel?: string }
): void {
  toast(message, {
    duration: Infinity,
    action: {
      label: options?.confirmLabel ?? 'Confirm',
      onClick: () => void onConfirm(),
    },
    cancel: {
      label: 'Cancel',
      onClick: () => {},
    },
  });
}

/** After a successful API mutation: toast, optional redirect, then refresh RSC data. */
export async function completeMutation(
  router: AppRouter,
  options: { successMessage: string; redirectTo?: string }
): Promise<void> {
  notifySuccess(options.successMessage);
  if (options.redirectTo) {
    await router.push(options.redirectTo);
  }
  router.refresh();
}

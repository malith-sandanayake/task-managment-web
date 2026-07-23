import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToastType =
  | "success"
  | "error"
  | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (
    message: string,
    type?: ToastType,
  ) => void;
}

const ToastContext =
  createContext<ToastContextValue | undefined>(
    undefined,
  );

let toastId = 0;

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({
  children,
}: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] =
    useState<Toast[]>([]);

  const removeToast = useCallback(
    (id: number): void => {
      setToasts((current) =>
        current.filter(
          (toast) => toast.id !== id,
        ),
      );
    },
    [],
  );

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
    ): void => {
      toastId += 1;

      const id = toastId;

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="toast-viewport"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role={
              toast.type === "error"
                ? "alert"
                : "status"
            }
          >
            <span>{toast.message}</span>

            <button
              type="button"
              onClick={() => {
                removeToast(toast.id);
              }}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider",
    );
  }

  return context;
}

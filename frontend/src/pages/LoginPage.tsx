import axios from "axios";
import {
  useState,
  type FormEvent,
} from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginLocationState {
  sessionExpired?: boolean;
}

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    login,
  } = useAuth();

  const { showToast } = useToast();

  const [email, setEmail] = useState(
    "admin@test.com",
  );

  const [password, setPassword] = useState(
    "123456",
  );

  const [errors, setErrors] =
    useState<LoginErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const locationState =
    location.state as
      | LoginLocationState
      | null;

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  function validateForm(): LoginErrors {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      nextErrors.email =
        "Enter a valid email address";
    }

    if (!password) {
      nextErrors.password =
        "Password is required";
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      showToast(
        "Signed in successfully.",
        "success",
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        setErrors({
          general:
            typeof message === "string"
              ? message
              : "Login failed",
        });
      } else {
        setErrors({
          general:
            "Something went wrong",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <p className="login-eyebrow">
            Task Management System
          </p>

          <h1>Welcome back</h1>

          <p>
            Sign in to manage your daily
            tasks.
          </p>
        </header>

        {locationState?.sessionExpired && (
          <div
            className="form-alert"
            role="alert"
          >
            Your session expired. Please sign
            in again.
          </div>
        )}

        <form
          className="login-form"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          noValidate
        >
          {errors.general && (
            <div
              className="form-alert"
              role="alert"
            >
              {errors.general}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value,
                );

                if (errors.email) {
                  setErrors((current) => ({
                    ...current,
                    email: undefined,
                  }));
                }
              }}
              aria-invalid={Boolean(
                errors.email,
              )}
              aria-describedby={
                errors.email
                  ? "email-error"
                  : undefined
              }
            />

            {errors.email && (
              <p
                id="email-error"
                className="field-error"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value,
                );

                if (errors.password) {
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                }
              }}
              aria-invalid={Boolean(
                errors.password,
              )}
              aria-describedby={
                errors.password
                  ? "password-error"
                  : undefined
              }
            />

            {errors.password && (
              <p
                id="password-error"
                className="field-error"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <footer className="login-footer">
          <p>Default credentials:</p>

          <code>
            admin@test.com / 123456
          </code>
        </footer>
      </section>
    </main>
  );
}

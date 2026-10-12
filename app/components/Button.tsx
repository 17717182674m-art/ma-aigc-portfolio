"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  ReactNode,
} from "react";

export type ButtonVariant =
  | "minimal"
  | "soft"
  | "text"
  | "icon"
  | "navigation";

export type ButtonSize = "sm" | "md" | "lg";

type ButtonIcon = ComponentType<{
  size?: number | string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

type SharedProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ButtonIcon;
  iconPosition?: "start" | "end";
  className?: string;
};

type NativeButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> & {
    href?: never;
  };

type LinkButtonProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> & {
    href: string;
    disabled?: boolean;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

export function buttonClassName({
  variant = "minimal",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
}: Pick<SharedProps, "variant" | "size" | "fullWidth" | "loading" | "className"> = {}) {
  return [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth ? "ui-button--full" : "",
    loading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  children,
  variant = "minimal",
  size = "md",
  fullWidth = false,
  loading = false,
  icon: Icon,
  iconPosition = "end",
  className = "",
  ...props
}: ButtonProps) {
  const content = (
    <span className="ui-button__content" aria-hidden={loading || undefined}>
      {Icon && iconPosition === "start" ? <Icon aria-hidden="true" /> : null}
      {children ? <span className="ui-button__label">{children}</span> : null}
      {Icon && iconPosition === "end" ? <Icon aria-hidden="true" /> : null}
    </span>
  );
  const loadingIndicator = loading ? (
    <span className="ui-button__spinner" aria-hidden="true" />
  ) : null;
  const classes = buttonClassName({ variant, size, fullWidth, loading, className });

  if ("href" in props && props.href) {
    const { disabled = false, onClick, ...anchorProps } = props;
    const blocked = disabled || loading;
    return (
      <a
        {...anchorProps}
        href={blocked ? undefined : props.href}
        className={classes}
        aria-disabled={blocked || undefined}
        aria-busy={loading || undefined}
        onClick={(event) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      >
        {content}
        {loadingIndicator}
      </a>
    );
  }

  const buttonProps = props as NativeButtonProps;
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={buttonProps.disabled || loading}
      aria-busy={loading || undefined}
    >
      {content}
      {loadingIndicator}
    </button>
  );
}

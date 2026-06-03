import * as React from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormInputProps extends React.ComponentProps<'input'> {
    label: string;
    error?: string;
    hint?: string;
    icon?: LucideIcon;
    containerClassName?: string;
    labelClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    (
        {
            label,
            error,
            hint,
            icon: Icon,
            type = 'text',
            className,
            containerClassName,
            labelClassName,
            id,
            required,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const [isFocused, setIsFocused] = React.useState(false);

        const isPassword = type === 'password';
        const inputType = isPassword
            ? showPassword
                ? 'text'
                : 'password'
            : type;
        const hasError = !!error;

        return (
            <div
                className={cn(
                    'flex w-full flex-col gap-1.5',
                    containerClassName,
                )}
            >
                {/* Label row */}
                <div className="flex items-center justify-between px-0.5">
                    <label
                        htmlFor={id}
                        className={cn(
                            'text-[13px] font-semibold tracking-wide transition-colors duration-200 select-none',
                            isFocused && !hasError
                                ? 'text-primary'
                                : 'text-foreground/80',
                            hasError && 'text-destructive',
                            labelClassName,
                        )}
                    >
                        {label}
                        {required && (
                            <span className="ml-1 text-destructive/70">*</span>
                        )}
                    </label>
                    {hint && !error && (
                        <span className="text-[11px] text-muted-foreground">
                            {hint}
                        </span>
                    )}
                </div>

                {/* Input wrapper */}
                <div className="relative flex items-center">
                    {/* Left icon */}
                    {Icon && (
                        <div
                            className={cn(
                                'pointer-events-none absolute left-3.5 flex items-center justify-center transition-colors duration-200',
                                isFocused && !hasError
                                    ? 'text-primary'
                                    : 'text-muted-foreground/60',
                                hasError && 'text-destructive/60',
                            )}
                        >
                            <Icon className="size-4" />
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={id}
                        type={inputType}
                        required={required}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        className={cn(
                            // Layout & base
                            'h-11 w-full rounded-xl border text-sm outline-none',
                            'transition-all duration-200 ease-in-out',
                            // Typography & bg
                            'bg-background/80 text-foreground placeholder:text-muted-foreground/50',
                            // Padding
                            Icon ? 'pl-10' : 'pl-3.5',
                            isPassword ? 'pr-11' : 'pr-3.5',
                            // Default border
                            'border-border/60 hover:border-border',
                            // Focus — glowing ring matching primary accent
                            !hasError &&
                                'focus:border-primary/60 focus:bg-background focus:ring-4 focus:ring-primary/[0.08]',
                            // Error
                            hasError && [
                                'border-destructive/60 bg-destructive/[0.02]',
                                'focus:border-destructive/80 focus:ring-4 focus:ring-destructive/[0.08]',
                            ],
                            // Disabled
                            'disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-50',
                            className,
                        )}
                        {...props}
                    />

                    {/* Password toggle */}
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            tabIndex={-1}
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                            className={cn(
                                'absolute right-3 flex items-center justify-center',
                                'rounded-md p-0.5 text-muted-foreground/50',
                                'hover:bg-accent/40 hover:text-foreground',
                                'transition-all duration-150 focus:outline-none',
                            )}
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    )}
                </div>

                {/* Error / helper */}
                {error ? (
                    <p
                        role="alert"
                        className="flex animate-in items-center gap-1 px-0.5 text-[11.5px] font-medium text-destructive duration-200 fade-in-50 slide-in-from-top-1"
                    >
                        <svg
                            className="size-3 shrink-0"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7.25 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
                        </svg>
                        {error}
                    </p>
                ) : null}
            </div>
        );
    },
);

FormInput.displayName = 'FormInput';

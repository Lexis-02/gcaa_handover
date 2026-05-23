import * as React from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormInputProps extends React.ComponentProps<'input'> {
    label: string;
    error?: string;
    icon?: LucideIcon;
    containerClassName?: string;
    labelClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    (
        {
            label,
            error,
            icon: Icon,
            type = 'text',
            className,
            containerClassName,
            labelClassName,
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const [isFocused, setIsFocused] = React.useState(false);
        
        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
        
        return (
            <div className={cn("grid gap-1.5 w-full relative group", containerClassName)}>
                <div className="flex justify-between items-center px-0.5">
                    <label
                        htmlFor={id}
                        className={cn(
                            'text-sm font-medium text-foreground transition-colors duration-200',
                            isFocused && 'text-primary',
                            error && 'text-destructive',
                            labelClassName,
                        )}
                    >
                        {label}
                    </label>
                </div>
                
                <div className="relative flex items-center">
                    {/* Left Icon */}
                    {Icon && (
                        <div className={cn(
                            "absolute left-3.5 flex items-center justify-center pointer-events-none transition-colors duration-200",
                            isFocused 
                                ? "text-accent" 
                                : "text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400"
                        )}>
                            <Icon className="h-4 w-4" />
                        </div>
                    )}
                    
                    <input
                        ref={ref}
                        id={id}
                        type={inputType}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        className={cn(
                            "w-full h-11 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all duration-300",
                            Icon ? "pl-11" : "pl-4",
                            isPassword ? "pr-11" : "pr-4",
                            // Default border styling
                            "border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700",
                            // Focus states with subtle navy glowing ring
                            "focus:border-accent/80 dark:focus:border-accent/80 focus:ring-4 focus:ring-accent/10 dark:focus:ring-accent/5 focus:bg-white dark:focus:bg-slate-950/80",
                            // Error states
                            error && "border-destructive dark:border-destructive/80 focus:border-destructive focus:ring-destructive/10 dark:focus:ring-destructive/5",
                            className
                        )}
                        {...props}
                    />
                    
                    {/* Password Eye Toggle */}
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 focus:outline-none transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
                
                {/* Error Message */}
                {error && (
                    <p className="text-[11px] text-destructive font-medium mt-0.5 px-0.5 animate-in fade-in-50 duration-200">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';


import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "btn-fill overflow-hidden bg-primary text-primary-foreground shadow-xs [--btn-fill:rgb(255_255_255/0.22)]",
        destructive:
          "btn-fill overflow-hidden bg-destructive text-white shadow-xs [--btn-fill:rgb(255_255_255/0.18)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "btn-fill overflow-hidden border border-input bg-background shadow-xs [--btn-fill:var(--primary)] hover:text-primary-foreground",
        secondary:
          "btn-fill overflow-hidden bg-secondary text-secondary-foreground shadow-xs [--btn-fill:var(--primary)]",
        ghost:
          "hover:bg-accent/70 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const classes = cn(buttonVariants({ variant, size, className }))
  const useFill =
    variant === "default" ||
    variant === "destructive" ||
    variant === "outline" ||
    variant === "secondary"

  if (asChild) {
    return (
      <Comp data-slot="button" className={classes} {...props}>
        {children}
      </Comp>
    )
  }

  if (!useFill) {
    return (
      <Comp data-slot="button" className={classes} {...props}>
        {children}
      </Comp>
    )
  }

  return (
    <Comp data-slot="button" className={classes} {...props}>
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }

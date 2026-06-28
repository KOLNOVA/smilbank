import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300",
      success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      destructive: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };

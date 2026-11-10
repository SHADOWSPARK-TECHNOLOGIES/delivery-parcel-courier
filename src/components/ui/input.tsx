import * as React from 'react';
import { cn } from '@/lib/format';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-line bg-surface/70 px-3 text-sm text-ink placeholder:text-dim outline-none transition-colors focus:border-cyan focus:ring-1 focus:ring-cyan/40',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm text-ink placeholder:text-dim outline-none transition-colors focus:border-cyan focus:ring-1 focus:ring-cyan/40',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-line bg-surface/70 px-3 text-sm text-ink outline-none transition-colors focus:border-cyan',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

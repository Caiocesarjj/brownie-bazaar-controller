
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value !== undefined && props.value !== '';

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "relative border rounded-lg transition-all duration-200 overflow-hidden",
          error ? "border-destructive" : "border-input",
          isFocused ? "ring-2 ring-ring/30" : "",
          className
        )}
      >
        <input
          id={id}
          className={cn(
            "w-full bg-transparent px-4 pt-6 pb-2 text-foreground outline-none",
            "placeholder:text-transparent transition-all duration-200"
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            isFocused || hasValue
              ? "top-2 text-xs text-muted-foreground"
              : "top-1/2 -translate-y-1/2 text-muted-foreground"
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <div className="text-xs text-destructive mt-1 ml-1">{error}</div>
      )}
    </div>
  );
};

export default AnimatedInput;

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "yflex ymin-h-[80px] yw-full yrounded-md yborder yborder-slate-200 ybg-white ypx-3 ypy-2 ytext-sm yring-offset-white placeholder:ytext-slate-500 focus-visible:youtline-none focus-visible:yring-2 focus-visible:yring-slate-950 focus-visible:yring-offset-2 disabled:ycursor-not-allowed disabled:yopacity-50 dark:yborder-slate-800 dark:ybg-slate-950 dark:yring-offset-slate-950 dark:placeholder:ytext-slate-400 dark:focus-visible:yring-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

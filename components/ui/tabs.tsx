"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "yinline-flex yh-10 yitems-center yjustify-center yrounded-md ybg-slate-100 yp-1 ytext-slate-500 dark:ybg-slate-800 dark:ytext-slate-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "yinline-flex yitems-center yjustify-center ywhitespace-nowrap yrounded-sm ypx-3 ypy-1.5 ytext-sm yfont-medium yring-offset-white ytransition-all focus-visible:youtline-none focus-visible:yring-2 focus-visible:yring-slate-950 focus-visible:yring-offset-2 disabled:ypointer-events-none disabled:yopacity-50 data-[state=active]:ybg-white data-[state=active]:ytext-slate-950 data-[state=active]:yshadow-sm dark:yring-offset-slate-950 dark:focus-visible:yring-slate-300 dark:data-[state=active]:ybg-slate-950 dark:data-[state=active]:ytext-slate-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ymt-2 yring-offset-white focus-visible:youtline-none focus-visible:yring-2 focus-visible:yring-slate-950 focus-visible:yring-offset-2 dark:yring-offset-slate-950 dark:focus-visible:yring-slate-300",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";
import * as __rspack_external__radix_ui_react_tabs_7bf5a77b from "@radix-ui/react-tabs";
const Tabs = __rspack_external__radix_ui_react_tabs_7bf5a77b.Root;
const TabsList = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_tabs_7bf5a77b.List, {
        ref: ref,
        className: cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className),
        ...props
    }));
TabsList.displayName = __rspack_external__radix_ui_react_tabs_7bf5a77b.List.displayName;
const TabsTrigger = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_tabs_7bf5a77b.Trigger, {
        ref: ref,
        className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs", className),
        ...props
    }));
TabsTrigger.displayName = __rspack_external__radix_ui_react_tabs_7bf5a77b.Trigger.displayName;
const TabsContent = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_tabs_7bf5a77b.Content, {
        ref: ref,
        className: cn("mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        ...props
    }));
TabsContent.displayName = __rspack_external__radix_ui_react_tabs_7bf5a77b.Content.displayName;
export { Tabs, TabsContent, TabsList, TabsTrigger };

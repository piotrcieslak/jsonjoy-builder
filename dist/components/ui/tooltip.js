import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";
import * as __rspack_external__radix_ui_react_tooltip_22b80323 from "@radix-ui/react-tooltip";
const TooltipProvider = __rspack_external__radix_ui_react_tooltip_22b80323.Provider;
const Tooltip = __rspack_external__radix_ui_react_tooltip_22b80323.Root;
const TooltipTrigger = __rspack_external__radix_ui_react_tooltip_22b80323.Trigger;
const TooltipContent = /*#__PURE__*/ forwardRef(({ className, sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_tooltip_22b80323.Content, {
        ref: ref,
        sideOffset: sideOffset,
        className: cn("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
        ...props
    }));
TooltipContent.displayName = __rspack_external__radix_ui_react_tooltip_22b80323.Content.displayName;
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

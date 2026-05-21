import { jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";
import * as __rspack_external__radix_ui_react_select_36a82244 from "@radix-ui/react-select";
const Select = __rspack_external__radix_ui_react_select_36a82244.Root;
const SelectGroup = __rspack_external__radix_ui_react_select_36a82244.Group;
const SelectValue = __rspack_external__radix_ui_react_select_36a82244.Value;
const SelectTrigger = /*#__PURE__*/ forwardRef(({ className, children, ...props }, ref)=>/*#__PURE__*/ jsxs(__rspack_external__radix_ui_react_select_36a82244.Trigger, {
        ref: ref,
        className: cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.Icon, {
                asChild: true,
                children: /*#__PURE__*/ jsx(ChevronDown, {
                    className: "h-4 w-4 opacity-50"
                })
            })
        ]
    }));
SelectTrigger.displayName = __rspack_external__radix_ui_react_select_36a82244.Trigger.displayName;
const SelectScrollUpButton = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.ScrollUpButton, {
        ref: ref,
        className: cn("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ jsx(ChevronUp, {
            className: "h-4 w-4"
        })
    }));
SelectScrollUpButton.displayName = __rspack_external__radix_ui_react_select_36a82244.ScrollUpButton.displayName;
const SelectScrollDownButton = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.ScrollDownButton, {
        ref: ref,
        className: cn("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ jsx(ChevronDown, {
            className: "h-4 w-4"
        })
    }));
SelectScrollDownButton.displayName = __rspack_external__radix_ui_react_select_36a82244.ScrollDownButton.displayName;
const SelectContent = /*#__PURE__*/ forwardRef(({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.Portal, {
        children: /*#__PURE__*/ jsxs(__rspack_external__radix_ui_react_select_36a82244.Content, {
            ref: ref,
            className: cn("relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "popper" === position && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className, "jsonjoy"),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ jsx(SelectScrollUpButton, {}),
                /*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.Viewport, {
                    className: cn("p-1", "popper" === position && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"),
                    children: children
                }),
                /*#__PURE__*/ jsx(SelectScrollDownButton, {})
            ]
        })
    }));
SelectContent.displayName = __rspack_external__radix_ui_react_select_36a82244.Content.displayName;
const SelectLabel = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.Label, {
        ref: ref,
        className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
        ...props
    }));
SelectLabel.displayName = __rspack_external__radix_ui_react_select_36a82244.Label.displayName;
const SelectItem = /*#__PURE__*/ forwardRef(({ className, children, ...props }, ref)=>/*#__PURE__*/ jsxs(__rspack_external__radix_ui_react_select_36a82244.Item, {
        ref: ref,
        className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ jsx("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.ItemIndicator, {
                    children: /*#__PURE__*/ jsx(Check, {
                        className: "h-4 w-4"
                    })
                })
            }),
            /*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.ItemText, {
                children: children
            })
        ]
    }));
SelectItem.displayName = __rspack_external__radix_ui_react_select_36a82244.Item.displayName;
const SelectSeparator = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_select_36a82244.Separator, {
        ref: ref,
        className: cn("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }));
SelectSeparator.displayName = __rspack_external__radix_ui_react_select_36a82244.Separator.displayName;
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };

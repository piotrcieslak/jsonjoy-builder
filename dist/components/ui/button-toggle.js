import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";
const ButtonToggle = /*#__PURE__*/ forwardRef(({ className, readOnly, onClick, children, ...props }, ref)=>/*#__PURE__*/ jsx("button", {
        type: "button",
        ref: ref,
        onClick: readOnly ? void 0 : onClick,
        className: cn("text-xs px-2 py-1 rounded-md font-medium min-w-[80px] text-center cursor-pointer hover:shadow-xs hover:ring-2 hover:ring-ring/30 active:scale-95 transition-all whitespace-nowrap", readOnly && "cursor-default", className),
        ...props,
        children: children
    }));
ButtonToggle.displayName = "ButtonToggle";
export { ButtonToggle };

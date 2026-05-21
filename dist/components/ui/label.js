import { jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";
import * as __rspack_external__radix_ui_react_label_49d956a0 from "@radix-ui/react-label";
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_label_49d956a0.Root, {
        ref: ref,
        className: cn(labelVariants(), className),
        ...props
    }));
Label.displayName = __rspack_external__radix_ui_react_label_49d956a0.Root.displayName;
export { Label };

import { jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils.js";
import * as __rspack_external__radix_ui_react_dialog_6b867f3d from "@radix-ui/react-dialog";
const Dialog = __rspack_external__radix_ui_react_dialog_6b867f3d.Root;
const DialogTrigger = __rspack_external__radix_ui_react_dialog_6b867f3d.Trigger;
const DialogPortal = __rspack_external__radix_ui_react_dialog_6b867f3d.Portal;
const DialogClose = __rspack_external__radix_ui_react_dialog_6b867f3d.Close;
const DialogOverlay = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_dialog_6b867f3d.Overlay, {
        ref: ref,
        className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 jsonjoy", className),
        ...props
    }));
DialogOverlay.displayName = __rspack_external__radix_ui_react_dialog_6b867f3d.Overlay.displayName;
const DialogContent = /*#__PURE__*/ forwardRef(({ className, children, ...props }, ref)=>{
    const dialogDescriptionId = useId();
    return /*#__PURE__*/ jsxs(DialogPortal, {
        children: [
            /*#__PURE__*/ jsx(DialogOverlay, {}),
            /*#__PURE__*/ jsxs(__rspack_external__radix_ui_react_dialog_6b867f3d.Content, {
                ref: ref,
                className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                "aria-describedby": dialogDescriptionId,
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ jsx(__rspack_external__radix_ui_react_dialog_6b867f3d.Description, {
                        id: dialogDescriptionId,
                        className: "sr-only",
                        children: "Dialog content"
                    }),
                    /*#__PURE__*/ jsxs(__rspack_external__radix_ui_react_dialog_6b867f3d.Close, {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ jsx(X, {
                                className: "h-4 w-4"
                            }),
                            /*#__PURE__*/ jsx("span", {
                                className: "sr-only",
                                children: "Close"
                            })
                        ]
                    })
                ]
            })
        ]
    });
});
DialogContent.displayName = __rspack_external__radix_ui_react_dialog_6b867f3d.Content.displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ jsx("div", {
        className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ jsx("div", {
        className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    });
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_dialog_6b867f3d.Title, {
        ref: ref,
        className: cn("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }));
DialogTitle.displayName = __rspack_external__radix_ui_react_dialog_6b867f3d.Title.displayName;
const DialogDescription = /*#__PURE__*/ forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx(__rspack_external__radix_ui_react_dialog_6b867f3d.Description, {
        ref: ref,
        className: cn("text-sm text-muted-foreground", className),
        ...props
    }));
DialogDescription.displayName = __rspack_external__radix_ui_react_dialog_6b867f3d.Description.displayName;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };

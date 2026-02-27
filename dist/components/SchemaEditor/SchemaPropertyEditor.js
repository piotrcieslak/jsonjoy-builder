import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input.js";
import { useTranslation } from "../../hooks/use-translation.js";
import { cn } from "../../lib/utils.js";
import { asObjectSchema, getSchemaDescription, withObjectSchema } from "../../types/jsonSchema.js";
import { Badge } from "../ui/badge.js";
import { ButtonToggle } from "../ui/button-toggle.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip.js";
import TypeDropdown from "./TypeDropdown.js";
import TypeEditor from "./TypeEditor.js";
const SchemaPropertyEditor = ({ name, schema, required, readOnly = false, validationNode, onDelete, onNameChange, onRequiredChange, onSchemaChange, onPropertyToggle, depth = 0, isPatternProperty = false })=>{
    const t = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempDesc, setTempDesc] = useState(getSchemaDescription(schema));
    const type = withObjectSchema(schema, (s)=>s.type || "object", "object");
    useEffect(()=>{
        setTempName(name);
        setTempDesc(getSchemaDescription(schema));
    }, [
        name,
        schema
    ]);
    const handleNameSubmit = ()=>{
        const trimmedName = tempName.trim();
        if (trimmedName && trimmedName !== name) onNameChange(trimmedName);
        else setTempName(name);
        setIsEditingName(false);
    };
    const handleDescSubmit = ()=>{
        const trimmedDesc = tempDesc.trim();
        if (trimmedDesc !== getSchemaDescription(schema)) onSchemaChange({
            ...asObjectSchema(schema),
            description: trimmedDesc || void 0
        });
        else setTempDesc(getSchemaDescription(schema));
        setIsEditingDesc(false);
    };
    const handleSchemaUpdate = (updatedSchema)=>{
        const description = getSchemaDescription(schema);
        onSchemaChange({
            ...updatedSchema,
            description: description || void 0
        });
    };
    return /*#__PURE__*/ jsxs("div", {
        className: cn("mb-2 animate-in rounded-lg border transition-all duration-200", depth > 0 && "ml-0 sm:ml-4 border-l border-l-border/40"),
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "relative json-field-row justify-between group",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "flex items-center gap-2 grow min-w-0",
                        children: [
                            /*#__PURE__*/ jsx("button", {
                                type: "button",
                                className: "text-muted-foreground hover:text-foreground transition-colors",
                                onClick: ()=>setExpanded(!expanded),
                                "aria-label": expanded ? t.collapse : t.expand,
                                children: expanded ? /*#__PURE__*/ jsx(ChevronDown, {
                                    size: 18
                                }) : /*#__PURE__*/ jsx(ChevronRight, {
                                    size: 18
                                })
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "flex items-center gap-2 grow min-w-0 overflow-visible",
                                children: [
                                    /*#__PURE__*/ jsxs("div", {
                                        className: "flex items-center gap-2 min-w-0 grow overflow-visible",
                                        children: [
                                            !readOnly && isEditingName ? /*#__PURE__*/ jsx(Input, {
                                                value: tempName,
                                                onChange: (e)=>setTempName(e.target.value),
                                                onBlur: handleNameSubmit,
                                                onKeyDown: (e)=>"Enter" === e.key && handleNameSubmit(),
                                                className: "h-8 text-sm font-medium min-w-[120px] max-w-full z-10",
                                                autoFocus: true,
                                                onFocus: (e)=>e.target.select()
                                            }) : /*#__PURE__*/ jsx("button", {
                                                type: "button",
                                                onClick: ()=>setIsEditingName(true),
                                                onKeyDown: (e)=>"Enter" === e.key && setIsEditingName(true),
                                                className: "json-field-label font-medium cursor-text px-2 py-0.5 -mx-0.5 rounded-sm hover:bg-secondary/30 hover:shadow-xs hover:ring-1 hover:ring-ring/20 transition-all text-left truncate min-w-[80px] max-w-[50%]",
                                                children: name
                                            }),
                                            !readOnly && isEditingDesc ? /*#__PURE__*/ jsx(Input, {
                                                value: tempDesc,
                                                onChange: (e)=>setTempDesc(e.target.value),
                                                onBlur: handleDescSubmit,
                                                onKeyDown: (e)=>"Enter" === e.key && handleDescSubmit(),
                                                placeholder: t.propertyDescriptionPlaceholder,
                                                className: "h-8 text-xs text-muted-foreground italic flex-1 min-w-[150px] z-10",
                                                autoFocus: true,
                                                onFocus: (e)=>e.target.select()
                                            }) : tempDesc ? /*#__PURE__*/ jsx("button", {
                                                type: "button",
                                                onClick: ()=>setIsEditingDesc(true),
                                                onKeyDown: (e)=>"Enter" === e.key && setIsEditingDesc(true),
                                                className: "text-xs text-muted-foreground italic cursor-text px-2 py-0.5 -mx-0.5 rounded-sm hover:bg-secondary/30 hover:shadow-xs hover:ring-1 hover:ring-ring/20 transition-all text-left truncate flex-1 max-w-[40%] mr-2",
                                                children: tempDesc
                                            }) : /*#__PURE__*/ jsx("button", {
                                                type: "button",
                                                onClick: ()=>setIsEditingDesc(true),
                                                onKeyDown: (e)=>"Enter" === e.key && setIsEditingDesc(true),
                                                className: "text-xs text-muted-foreground/50 italic cursor-text px-2 py-0.5 -mx-0.5 rounded-sm hover:bg-secondary/30 hover:shadow-xs hover:ring-1 hover:ring-ring/20 transition-all opacity-0 group-hover:opacity-100 text-left truncate flex-1 max-w-[40%] mr-2",
                                                children: t.propertyDescriptionButton
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ jsxs("div", {
                                        className: "flex items-center gap-2 justify-end shrink-0",
                                        children: [
                                            /*#__PURE__*/ jsx(ButtonToggle, {
                                                onClick: ()=>{
                                                    onPropertyToggle?.(name, isPatternProperty);
                                                },
                                                className: isPatternProperty ? "bg-emerald-50 text-emerald-600" : "bg-secondary text-muted-foreground",
                                                children: isPatternProperty ? t.patternPropertiesTitleShort : t.regularPropertiesTitleShort
                                            }),
                                            /*#__PURE__*/ jsx(TypeDropdown, {
                                                value: type,
                                                readOnly: readOnly,
                                                onChange: (newType)=>{
                                                    onSchemaChange({
                                                        ...asObjectSchema(schema),
                                                        type: newType
                                                    });
                                                }
                                            }),
                                            isPatternProperty ? /*#__PURE__*/ jsx(TooltipProvider, {
                                                children: /*#__PURE__*/ jsxs(Tooltip, {
                                                    children: [
                                                        /*#__PURE__*/ jsx(TooltipTrigger, {
                                                            asChild: true,
                                                            children: /*#__PURE__*/ jsx("div", {
                                                                className: cn("text-xs px-2 py-1 rounded-md font-medium min-w-[80px] text-center whitespace-nowrap cursor-default", "bg-secondary text-muted-foreground"),
                                                                children: t.propertyOptional
                                                            })
                                                        }),
                                                        /*#__PURE__*/ jsx(TooltipContent, {
                                                            className: "max-w-[90vw]",
                                                            children: t.propertyRequiredToggleDisabledTooltip
                                                        })
                                                    ]
                                                })
                                            }) : /*#__PURE__*/ jsx(ButtonToggle, {
                                                onClick: ()=>!readOnly && onRequiredChange(!required),
                                                className: required ? "bg-red-50 text-red-500" : "bg-secondary text-muted-foreground",
                                                children: required ? t.propertyRequired : t.propertyOptional
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    validationNode?.cumulativeChildrenErrors > 0 && /*#__PURE__*/ jsx(Badge, {
                        className: "h-5 min-w-5 rounded-full px-1 font-mono tabular-nums justify-center",
                        variant: "destructive",
                        children: validationNode.cumulativeChildrenErrors
                    }),
                    !readOnly && /*#__PURE__*/ jsx("div", {
                        className: "flex items-center gap-1 text-muted-foreground",
                        children: /*#__PURE__*/ jsx("button", {
                            type: "button",
                            onClick: onDelete,
                            className: "p-1 rounded-md hover:bg-secondary hover:text-destructive transition-colors opacity-0 group-hover:opacity-100",
                            "aria-label": t.propertyDelete,
                            children: /*#__PURE__*/ jsx(X, {
                                size: 16
                            })
                        })
                    })
                ]
            }),
            expanded && /*#__PURE__*/ jsxs("div", {
                className: "pt-1 pb-2 px-2 sm:px-3 animate-in",
                children: [
                    readOnly && tempDesc && /*#__PURE__*/ jsx("p", {
                        className: "pb-2",
                        children: tempDesc
                    }),
                    /*#__PURE__*/ jsx(TypeEditor, {
                        schema: schema,
                        readOnly: readOnly,
                        validationNode: validationNode,
                        onChange: handleSchemaUpdate,
                        depth: depth + 1
                    })
                ]
            })
        ]
    });
};
const SchemaEditor_SchemaPropertyEditor = SchemaPropertyEditor;
export { SchemaPropertyEditor, SchemaEditor_SchemaPropertyEditor as default };

import { jsx, jsxs } from "react/jsx-runtime";
import { useId, useMemo, useState } from "react";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";
import { useTranslation } from "../../../hooks/use-translation.js";
import { getArrayItemsSchema } from "../../../lib/schemaEditor.js";
import { cn } from "../../../lib/utils.js";
import { isBooleanSchema, withObjectSchema } from "../../../types/jsonSchema.js";
import TypeDropdown from "../TypeDropdown.js";
import TypeEditor from "../TypeEditor.js";
const ArrayEditor = ({ schema, readOnly = false, validationNode, onChange, depth = 0 })=>{
    const t = useTranslation();
    const [minItems, setMinItems] = useState(withObjectSchema(schema, (s)=>s.minItems, void 0));
    const [maxItems, setMaxItems] = useState(withObjectSchema(schema, (s)=>s.maxItems, void 0));
    const [uniqueItems, setUniqueItems] = useState(withObjectSchema(schema, (s)=>s.uniqueItems || false, false));
    const minItemsId = useId();
    const maxItemsId = useId();
    const uniqueItemsId = useId();
    const itemsSchema = getArrayItemsSchema(schema) || {
        type: "string"
    };
    const itemType = withObjectSchema(itemsSchema, (s)=>s.type || "string", "string");
    const handleValidationChange = ()=>{
        const propsToKeep = buildValidationProps();
        onChange(propsToKeep);
    };
    const buildValidationProps = ({ minItems: overrideMinItems, maxItems: overrideMaxItems, uniqueItems: overrideUniqueItems } = {})=>{
        const validationProps = {
            type: "array",
            ...isBooleanSchema(schema) ? {} : schema,
            minItems: overrideMinItems || minItems,
            maxItems: overrideMaxItems || maxItems,
            uniqueItems: overrideUniqueItems || void 0
        };
        if (void 0 === validationProps.items && itemsSchema) validationProps.items = itemsSchema;
        const propsToKeep = {};
        for (const [key, value] of Object.entries(validationProps))if (void 0 !== value) propsToKeep[key] = value;
        return propsToKeep;
    };
    const handleItemSchemaChange = (updatedItemSchema)=>{
        const updatedSchema = {
            type: "array",
            ...isBooleanSchema(schema) ? {} : schema,
            items: updatedItemSchema
        };
        onChange(updatedSchema);
    };
    const minMaxError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"minmax" === err.path[0])?.message, [
        validationNode
    ]);
    const minItemsError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"minItems" === err.path[0])?.message, [
        validationNode
    ]);
    const maxItemsError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"maxItems" === err.path[0])?.message, [
        validationNode
    ]);
    return /*#__PURE__*/ jsxs("div", {
        className: "space-y-6",
        children: [
            (!readOnly || !!maxItems || !!minItems) && /*#__PURE__*/ jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    (!readOnly || !!minItems) && /*#__PURE__*/ jsxs("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                htmlFor: minItemsId,
                                className: (!!minMaxError || !!minItemsError) && "text-destructive",
                                children: t.arrayMinimumLabel
                            }),
                            /*#__PURE__*/ jsx(Input, {
                                id: minItemsId,
                                type: "number",
                                min: 0,
                                value: minItems ?? "",
                                onChange: (e)=>{
                                    const value = e.target.value ? Number(e.target.value) : void 0;
                                    setMinItems(value);
                                },
                                onBlur: handleValidationChange,
                                placeholder: t.arrayMinimumPlaceholder,
                                className: cn("h-8", !!minMaxError && "border-destructive")
                            })
                        ]
                    }),
                    (!readOnly || !!maxItems) && /*#__PURE__*/ jsxs("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                htmlFor: maxItemsId,
                                className: (!!minMaxError || !!maxItemsError) && "text-destructive",
                                children: t.arrayMaximumLabel
                            }),
                            /*#__PURE__*/ jsx(Input, {
                                id: maxItemsId,
                                type: "number",
                                min: 0,
                                value: maxItems ?? "",
                                onChange: (e)=>{
                                    const value = e.target.value ? Number(e.target.value) : void 0;
                                    setMaxItems(value);
                                },
                                onBlur: handleValidationChange,
                                placeholder: t.arrayMaximumPlaceholder,
                                className: cn("h-8", !!minMaxError && "border-destructive")
                            })
                        ]
                    }),
                    (!!minMaxError || !!minItemsError || !!maxItemsError) && /*#__PURE__*/ jsx("div", {
                        className: "text-xs text-destructive italic md:col-span-2 whitespace-pre-line",
                        children: [
                            minMaxError,
                            minItemsError ?? maxItemsError
                        ].filter(Boolean).join("\n")
                    })
                ]
            }),
            (!readOnly || !!uniqueItems) && /*#__PURE__*/ jsxs("div", {
                className: "flex items-center space-x-2",
                children: [
                    /*#__PURE__*/ jsx(Switch, {
                        id: uniqueItemsId,
                        checked: uniqueItems,
                        onCheckedChange: (checked)=>{
                            setUniqueItems(checked);
                            onChange(buildValidationProps({
                                uniqueItems: checked
                            }));
                        }
                    }),
                    /*#__PURE__*/ jsx(Label, {
                        htmlFor: uniqueItemsId,
                        className: "cursor-pointer",
                        children: t.arrayForceUniqueItemsLabel
                    })
                ]
            }),
            /*#__PURE__*/ jsxs("div", {
                className: cn("space-y-2 pt-4 border-border/40", !readOnly || minItems || maxItems || uniqueItems ? "border-t" : null),
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                children: t.arrayItemTypeLabel
                            }),
                            /*#__PURE__*/ jsx(TypeDropdown, {
                                readOnly: readOnly,
                                value: itemType,
                                onChange: (newType)=>{
                                    handleItemSchemaChange({
                                        ...withObjectSchema(itemsSchema, (s)=>s, {}),
                                        type: newType
                                    });
                                }
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx(TypeEditor, {
                        readOnly: readOnly,
                        schema: itemsSchema,
                        validationNode: validationNode,
                        onChange: handleItemSchemaChange,
                        depth: depth + 1
                    })
                ]
            })
        ]
    });
};
const types_ArrayEditor = ArrayEditor;
export { types_ArrayEditor as default };

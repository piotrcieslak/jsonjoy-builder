import { jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { useTranslation } from "../../../hooks/use-translation.js";
import { cn } from "../../../lib/utils.js";
import { isBooleanSchema, withObjectSchema } from "../../../types/jsonSchema.js";
const NumberEditor = ({ schema, validationNode, onChange, integer = false, readOnly = false })=>{
    const [enumValue, setEnumValue] = useState("");
    const t = useTranslation();
    const maximumId = useId();
    const minimumId = useId();
    const exclusiveMinimumId = useId();
    const exclusiveMaximumId = useId();
    const multipleOfId = useId();
    const minimum = withObjectSchema(schema, (s)=>s.minimum, void 0);
    const maximum = withObjectSchema(schema, (s)=>s.maximum, void 0);
    const exclusiveMinimum = withObjectSchema(schema, (s)=>s.exclusiveMinimum, void 0);
    const exclusiveMaximum = withObjectSchema(schema, (s)=>s.exclusiveMaximum, void 0);
    const multipleOf = withObjectSchema(schema, (s)=>s.multipleOf, void 0);
    const enumValues = withObjectSchema(schema, (s)=>s.enum || [], []);
    const handleValidationChange = (property, value)=>{
        const baseProperties = {
            type: integer ? "integer" : "number"
        };
        if (!isBooleanSchema(schema)) {
            if (void 0 !== schema.minimum) baseProperties.minimum = schema.minimum;
            if (void 0 !== schema.maximum) baseProperties.maximum = schema.maximum;
            if (void 0 !== schema.exclusiveMinimum) baseProperties.exclusiveMinimum = schema.exclusiveMinimum;
            if (void 0 !== schema.exclusiveMaximum) baseProperties.exclusiveMaximum = schema.exclusiveMaximum;
            if (void 0 !== schema.multipleOf) baseProperties.multipleOf = schema.multipleOf;
            if (void 0 !== schema.enum) baseProperties.enum = schema.enum;
        }
        if (void 0 !== value) {
            const updatedProperties = {
                ...baseProperties
            };
            if ("minimum" === property) updatedProperties.minimum = value;
            else if ("maximum" === property) updatedProperties.maximum = value;
            else if ("exclusiveMinimum" === property) updatedProperties.exclusiveMinimum = value;
            else if ("exclusiveMaximum" === property) updatedProperties.exclusiveMaximum = value;
            else if ("multipleOf" === property) updatedProperties.multipleOf = value;
            else if ("enum" === property) updatedProperties.enum = value;
            onChange(updatedProperties);
            return;
        }
        if ("minimum" === property) {
            const { minimum: _, ...rest } = baseProperties;
            onChange(rest);
            return;
        }
        if ("maximum" === property) {
            const { maximum: _, ...rest } = baseProperties;
            onChange(rest);
            return;
        }
        if ("exclusiveMinimum" === property) {
            const { exclusiveMinimum: _, ...rest } = baseProperties;
            onChange(rest);
            return;
        }
        if ("exclusiveMaximum" === property) {
            const { exclusiveMaximum: _, ...rest } = baseProperties;
            onChange(rest);
            return;
        }
        if ("multipleOf" === property) {
            const { multipleOf: _, ...rest } = baseProperties;
            onChange(rest);
            return;
        }
        if ("enum" === property) {
            const { enum: _, ...rest } = baseProperties;
            onChange(rest);
            return;
        }
        onChange(baseProperties);
    };
    const handleAddEnumValue = ()=>{
        if (!enumValue.trim()) return;
        const numValue = Number(enumValue);
        if (Number.isNaN(numValue)) return;
        const validValue = integer ? Math.floor(numValue) : numValue;
        if (!enumValues.includes(validValue)) handleValidationChange("enum", [
            ...enumValues,
            validValue
        ]);
        setEnumValue("");
    };
    const handleRemoveEnumValue = (index)=>{
        const newEnumValues = [
            ...enumValues
        ];
        newEnumValues.splice(index, 1);
        0 === newEnumValues.length ? handleValidationChange("enum", void 0) : handleValidationChange("enum", newEnumValues);
    };
    const minMaxError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"minMax" === err.path[0])?.message, [
        validationNode
    ]);
    const redundantMinError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"redundantMinimum" === err.path[0])?.message, [
        validationNode
    ]);
    const redundantMaxError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"redundantMaximum" === err.path[0])?.message, [
        validationNode
    ]);
    const enumError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"enum" === err.path[0])?.message, [
        validationNode
    ]);
    const multipleOfError = useMemo(()=>validationNode?.validation.errors?.find((err)=>"multipleOf" === err.path[0])?.message, [
        validationNode
    ]);
    const hasConstraint = !!minimum || !!maximum || !!exclusiveMinimum || !!exclusiveMaximum || !!multipleOf || enumValues.length > 0;
    return /*#__PURE__*/ jsxs("div", {
        className: "space-y-4",
        children: [
            readOnly && !hasConstraint && /*#__PURE__*/ jsx("p", {
                className: "text-sm text-muted-foreground italic",
                children: t.numberNoConstraint
            }),
            (!readOnly || hasConstraint) && /*#__PURE__*/ jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "space-y-0 md:col-span-2",
                        children: [
                            !!minMaxError && /*#__PURE__*/ jsx("div", {
                                className: "text-xs text-destructive italic",
                                children: minMaxError
                            }),
                            !!redundantMinError && /*#__PURE__*/ jsx("div", {
                                className: "text-xs text-destructive italic",
                                children: redundantMinError
                            }),
                            !!redundantMaxError && /*#__PURE__*/ jsx("div", {
                                className: "text-xs text-destructive italic",
                                children: redundantMaxError
                            }),
                            !!enumError && /*#__PURE__*/ jsx("div", {
                                className: "text-xs text-destructive italic",
                                children: enumError
                            })
                        ]
                    }),
                    (!readOnly || !!minimum) && /*#__PURE__*/ jsxs("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                htmlFor: minimumId,
                                className: void 0 !== minimum && (!!minMaxError || !!redundantMinError) && "text-destructive",
                                children: t.numberMinimumLabel
                            }),
                            /*#__PURE__*/ jsx(Input, {
                                id: minimumId,
                                type: "number",
                                value: void 0 !== minimum ? minimum : "",
                                onChange: (e)=>{
                                    const value = e.target.value ? Number(e.target.value) : void 0;
                                    handleValidationChange("minimum", value);
                                },
                                placeholder: t.numberMinimumPlaceholder,
                                className: cn("h-8", void 0 !== minimum && (!!minMaxError || !!redundantMinError) && "border-destructive"),
                                step: integer ? 1 : "any"
                            })
                        ]
                    }),
                    (!readOnly || !!maximum) && /*#__PURE__*/ jsxs("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                htmlFor: maximumId,
                                className: void 0 !== maximum && (!!minMaxError || !!redundantMaxError) && "text-destructive",
                                children: t.numberMaximumLabel
                            }),
                            /*#__PURE__*/ jsx(Input, {
                                id: maximumId,
                                type: "number",
                                value: maximum ?? "",
                                onChange: (e)=>{
                                    const value = e.target.value ? Number(e.target.value) : void 0;
                                    handleValidationChange("maximum", value);
                                },
                                placeholder: t.numberMaximumPlaceholder,
                                className: cn("h-8", void 0 !== maximum && (!!minMaxError || !!redundantMaxError) && "border-destructive"),
                                step: integer ? 1 : "any"
                            })
                        ]
                    })
                ]
            }),
            (!readOnly || !!exclusiveMaximum || !!exclusiveMinimum) && /*#__PURE__*/ jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    (!readOnly || !!exclusiveMinimum) && /*#__PURE__*/ jsxs("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                htmlFor: exclusiveMinimumId,
                                className: void 0 !== exclusiveMinimum && (!!minMaxError || !!redundantMinError) && "text-destructive",
                                children: t.numberExclusiveMinimumLabel
                            }),
                            /*#__PURE__*/ jsx(Input, {
                                id: exclusiveMinimumId,
                                type: "number",
                                value: exclusiveMinimum ?? "",
                                onChange: (e)=>{
                                    const value = e.target.value ? Number(e.target.value) : void 0;
                                    handleValidationChange("exclusiveMinimum", value);
                                },
                                placeholder: t.numberExclusiveMinimumPlaceholder,
                                className: cn("h-8", void 0 !== exclusiveMinimum && (!!minMaxError || !!redundantMinError) && "border-destructive"),
                                step: integer ? 1 : "any"
                            })
                        ]
                    }),
                    (!readOnly || !!exclusiveMaximum) && /*#__PURE__*/ jsxs("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                htmlFor: exclusiveMaximumId,
                                className: void 0 !== exclusiveMaximum && (!!minMaxError || !!redundantMaxError) && "text-destructive",
                                children: t.numberExclusiveMaximumLabel
                            }),
                            /*#__PURE__*/ jsx(Input, {
                                id: exclusiveMaximumId,
                                type: "number",
                                value: exclusiveMaximum ?? "",
                                onChange: (e)=>{
                                    const value = e.target.value ? Number(e.target.value) : void 0;
                                    handleValidationChange("exclusiveMaximum", value);
                                },
                                placeholder: t.numberExclusiveMaximumPlaceholder,
                                className: cn("h-8", void 0 !== exclusiveMaximum && (!!minMaxError || !!redundantMaxError) && "border-destructive"),
                                step: integer ? 1 : "any"
                            })
                        ]
                    })
                ]
            }),
            (!readOnly || !!multipleOf) && /*#__PURE__*/ jsxs("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ jsx(Label, {
                        htmlFor: multipleOfId,
                        className: !!multipleOfError && "text-destructive",
                        children: t.numberMultipleOfLabel
                    }),
                    /*#__PURE__*/ jsx(Input, {
                        id: multipleOfId,
                        type: "number",
                        value: multipleOf ?? "",
                        onChange: (e)=>{
                            const value = e.target.value ? Number(e.target.value) : void 0;
                            handleValidationChange("multipleOf", value);
                        },
                        placeholder: t.numberMultipleOfPlaceholder,
                        className: cn("h-8", !!multipleOfError && "border-destructive"),
                        min: 0,
                        step: integer ? 1 : "any"
                    }),
                    !!multipleOfError && /*#__PURE__*/ jsx("div", {
                        className: "text-xs text-destructive italic whitespace-pre-line",
                        children: multipleOfError
                    })
                ]
            }),
            (!readOnly || enumValues.length > 0) && /*#__PURE__*/ jsxs("div", {
                className: "space-y-2 pt-2 border-t border-border/40",
                children: [
                    /*#__PURE__*/ jsx(Label, {
                        className: !!enumError && "text-destructive",
                        children: t.numberAllowedValuesEnumLabel
                    }),
                    /*#__PURE__*/ jsx("div", {
                        className: "flex flex-wrap gap-2 mb-4",
                        children: enumValues.length > 0 ? enumValues.map((value, index)=>/*#__PURE__*/ jsxs("div", {
                                className: "flex items-center bg-muted/40 border rounded-md px-2 py-1 text-xs",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "mr-1",
                                        children: value
                                    }),
                                    /*#__PURE__*/ jsx("button", {
                                        type: "button",
                                        onClick: ()=>handleRemoveEnumValue(index),
                                        className: "text-muted-foreground hover:text-destructive",
                                        children: /*#__PURE__*/ jsx(X, {
                                            size: 12
                                        })
                                    })
                                ]
                            }, `enum-number-${value}`)) : /*#__PURE__*/ jsx("p", {
                            className: "text-xs text-muted-foreground italic",
                            children: t.numberAllowedValuesEnumNone
                        })
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ jsx(Input, {
                                type: "number",
                                value: enumValue,
                                onChange: (e)=>setEnumValue(e.target.value),
                                placeholder: t.numberAllowedValuesEnumAddPlaceholder,
                                className: "h-8 text-xs flex-1",
                                onKeyDown: (e)=>"Enter" === e.key && handleAddEnumValue(),
                                step: integer ? 1 : "any"
                            }),
                            /*#__PURE__*/ jsx("button", {
                                type: "button",
                                onClick: handleAddEnumValue,
                                className: "px-3 py-1 h-8 rounded-md bg-secondary text-xs font-medium hover:bg-secondary/80",
                                children: t.numberAllowedValuesEnumAddLabel
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
const types_NumberEditor = NumberEditor;
export { types_NumberEditor as default };

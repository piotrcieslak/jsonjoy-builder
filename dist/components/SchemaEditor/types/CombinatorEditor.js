import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronRight, CirclePlus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../../ui/input.js";
import { useTranslation } from "../../../hooks/use-translation.js";
import { cn } from "../../../lib/utils.js";
import { getEditorType, getSchemaDescription, isBooleanSchema } from "../../../types/jsonSchema.js";
import TypeDropdown from "../TypeDropdown.js";
import TypeEditor from "../TypeEditor.js";
function getCombinatorStrings(t, combinator) {
    switch(combinator){
        case "anyOf":
            return {
                description: t.anyOfDescription,
                addButton: t.anyOfAddOption,
                removeButton: t.anyOfRemoveOption,
                itemLabel: t.anyOfOptionLabel,
                noItems: t.anyOfNoOptions
            };
        case "oneOf":
            return {
                description: t.oneOfDescription,
                addButton: t.oneOfAddOption,
                removeButton: t.oneOfRemoveOption,
                itemLabel: t.oneOfOptionLabel,
                noItems: t.oneOfNoOptions
            };
        case "allOf":
            return {
                description: t.allOfDescription,
                addButton: t.allOfAddSchema,
                removeButton: t.allOfRemoveSchema,
                itemLabel: t.allOfSchemaLabel,
                noItems: t.allOfNoSchemas
            };
    }
}
const DEFAULT_SCHEMAS = {
    string: {
        type: "string"
    },
    number: {
        type: "number"
    },
    integer: {
        type: "integer"
    },
    boolean: {
        type: "boolean"
    },
    object: {
        type: "object"
    },
    array: {
        type: "array"
    },
    null: {
        type: "null"
    },
    anyOf: {
        anyOf: [
            {
                type: "string"
            },
            {
                type: "number"
            }
        ]
    },
    oneOf: {
        oneOf: [
            {
                type: "string"
            },
            {
                type: "number"
            }
        ]
    },
    allOf: {
        allOf: [
            {
                type: "object"
            }
        ]
    }
};
let idCounter = 0;
const nextId = ()=>`combinator-${++idCounter}`;
const CombinatorEditor = ({ schema, readOnly = false, validationNode, onChange, schemaKey, onAddEnum, onDeleteEnum, depth = 0, combinator })=>{
    const t = useTranslation();
    const strings = getCombinatorStrings(t, combinator);
    const rawOptions = isBooleanSchema(schema) ? [] : schema[combinator] ?? [];
    const [ids, setIds] = useState(()=>rawOptions.map(()=>nextId()));
    const options = useMemo(()=>{
        if (rawOptions.length !== ids.length) setIds(rawOptions.map((_o, i)=>ids[i] ?? nextId()));
        return rawOptions;
    }, [
        rawOptions,
        ids
    ]);
    const [expandedId, setExpandedId] = useState(null);
    const [descFocusId, setDescFocusId] = useState(null);
    useEffect(()=>{
        if (null !== descFocusId && !ids.includes(descFocusId)) setDescFocusId(null);
    }, [
        descFocusId,
        ids
    ]);
    const updateOptions = useCallback((newOptions)=>{
        const base = isBooleanSchema(schema) ? {} : schema;
        const { [combinator]: _old, type: _type, ...rest } = base;
        onChange({
            ...rest,
            [combinator]: newOptions
        });
    }, [
        schema,
        onChange,
        combinator
    ]);
    const handleAddOption = ()=>{
        const newId = nextId();
        setIds((prev)=>[
                ...prev,
                newId
            ]);
        updateOptions([
            ...options,
            {
                type: "string"
            }
        ]);
        setExpandedId(newId);
    };
    const handleRemoveOption = (index)=>{
        const newOptions = options.filter((_, i)=>i !== index);
        setIds((prev)=>prev.filter((_, i)=>i !== index));
        updateOptions(newOptions);
        if (expandedId === ids[index]) setExpandedId(null);
    };
    const handleOptionTypeChange = (index, newType)=>{
        const newOptions = [
            ...options
        ];
        const prevDesc = getSchemaDescription(options[index]);
        let next = DEFAULT_SCHEMAS[newType] ?? DEFAULT_SCHEMAS[newType] ?? {
            type: "string"
        };
        if ("" !== prevDesc) next = {
            ...next,
            description: prevDesc
        };
        newOptions[index] = next;
        updateOptions(newOptions);
    };
    const handleOptionDescriptionChange = (index, value)=>{
        const opt = options[index];
        const description = "" === value ? void 0 : value;
        let updated;
        if (isBooleanSchema(opt)) updated = true === opt ? void 0 !== description ? {
            description
        } : true : void 0 !== description ? {
            description
        } : false;
        else {
            const base = {
                ...opt
            };
            if (void 0 !== description) base.description = description;
            else delete base.description;
            updated = base;
        }
        const newOptions = [
            ...options
        ];
        newOptions[index] = updated;
        updateOptions(newOptions);
    };
    const handleOptionSchemaChange = (index, updatedSchema)=>{
        const newOptions = [
            ...options
        ];
        newOptions[index] = updatedSchema;
        updateOptions(newOptions);
    };
    return /*#__PURE__*/ jsxs("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ jsx("p", {
                className: "text-xs text-muted-foreground italic",
                children: strings.description
            }),
            0 === options.length ? /*#__PURE__*/ jsx("div", {
                className: "text-sm text-muted-foreground italic p-2 text-center border rounded-md",
                children: strings.noItems
            }) : /*#__PURE__*/ jsx("div", {
                className: "space-y-2",
                children: options.map((option, index)=>{
                    const id = ids[index];
                    const optionDescription = getSchemaDescription(option);
                    const optionType = getEditorType(option);
                    const isExpanded = expandedId === id;
                    return /*#__PURE__*/ jsxs("div", {
                        className: cn("group rounded-lg border transition-all duration-200", depth > 0 && "ml-0 sm:ml-4 border-l border-l-border/40"),
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                className: "flex flex-wrap items-center gap-2 px-3 py-2 sm:flex-nowrap",
                                children: [
                                    /*#__PURE__*/ jsxs("button", {
                                        type: "button",
                                        className: "flex shrink-0 items-center gap-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                                        onClick: ()=>setExpandedId(isExpanded ? null : id ?? null),
                                        children: [
                                            isExpanded ? /*#__PURE__*/ jsx(ChevronDown, {
                                                size: 18
                                            }) : /*#__PURE__*/ jsx(ChevronRight, {
                                                size: 18
                                            }),
                                            /*#__PURE__*/ jsxs("span", {
                                                className: "shrink-0",
                                                children: [
                                                    strings.itemLabel,
                                                    " ",
                                                    index + 1
                                                ]
                                            })
                                        ]
                                    }),
                                    readOnly ? optionDescription ? /*#__PURE__*/ jsx("span", {
                                        className: "flex-1 truncate px-2 py-0.5 text-left text-xs text-muted-foreground italic",
                                        children: optionDescription
                                    }) : null : descFocusId === id ? /*#__PURE__*/ jsx(Input, {
                                        "aria-label": t.propertyDescriptionPlaceholder,
                                        autoFocus: true,
                                        className: "z-10 min-w-40 flex-1 text-xs",
                                        placeholder: t.propertyDescriptionPlaceholder,
                                        value: optionDescription,
                                        onBlur: (e)=>{
                                            handleOptionDescriptionChange(index, e.target.value.trim());
                                            setDescFocusId(null);
                                        },
                                        onChange: (e)=>handleOptionDescriptionChange(index, e.target.value),
                                        onFocus: (e)=>e.target.select(),
                                        onKeyDown: (e)=>{
                                            if ("Enter" === e.key) {
                                                e.preventDefault();
                                                e.currentTarget.blur();
                                            }
                                        }
                                    }) : optionDescription ? /*#__PURE__*/ jsx("button", {
                                        type: "button",
                                        className: "mr-2 min-w-0 flex-1 cursor-text truncate rounded-sm px-2 py-0.5 text-left text-xs text-muted-foreground italic transition-all -mx-0.5 hover:bg-secondary/30 hover:ring-1 hover:ring-ring/20 hover:shadow-xs",
                                        onClick: ()=>setDescFocusId(id),
                                        onKeyDown: (e)=>"Enter" === e.key && setDescFocusId(id),
                                        children: optionDescription
                                    }) : /*#__PURE__*/ jsx("button", {
                                        type: "button",
                                        className: "mr-2 min-w-0 flex-1 cursor-text truncate rounded-sm px-2 py-0.5 text-left text-xs text-muted-foreground/50 italic opacity-0 transition-all -mx-0.5 hover:bg-secondary/30 hover:ring-1 hover:ring-ring/20 hover:shadow-xs group-hover:opacity-100",
                                        onClick: ()=>setDescFocusId(id),
                                        onKeyDown: (e)=>"Enter" === e.key && setDescFocusId(id),
                                        children: t.propertyDescriptionButton
                                    }),
                                    /*#__PURE__*/ jsxs("div", {
                                        className: "flex shrink-0 items-center gap-2 sm:ml-auto",
                                        children: [
                                            /*#__PURE__*/ jsx(TypeDropdown, {
                                                value: optionType,
                                                readOnly: readOnly,
                                                onChange: (newType)=>handleOptionTypeChange(index, newType)
                                            }),
                                            !readOnly && /*#__PURE__*/ jsx("button", {
                                                type: "button",
                                                onClick: ()=>handleRemoveOption(index),
                                                className: "p-1 rounded-md hover:bg-secondary hover:text-destructive transition-colors text-muted-foreground",
                                                "aria-label": strings.removeButton,
                                                children: /*#__PURE__*/ jsx(X, {
                                                    size: 14
                                                })
                                            })
                                        ]
                                    })
                                ]
                            }),
                            isExpanded && /*#__PURE__*/ jsx("div", {
                                className: "pt-1 pb-2 px-3 border-t animate-in",
                                children: /*#__PURE__*/ jsx(TypeEditor, {
                                    readOnly: readOnly,
                                    schema: option,
                                    validationNode: validationNode?.children[`${combinator}:${index}`],
                                    onChange: (updatedSchema)=>handleOptionSchemaChange(index, updatedSchema),
                                    schemaKey: schemaKey ? `${schemaKey}.${combinator}[${index}]` : `${combinator}[${index}]`,
                                    onAddEnum: onAddEnum,
                                    onDeleteEnum: onDeleteEnum,
                                    depth: depth + 1
                                })
                            })
                        ]
                    }, id);
                })
            }),
            !readOnly && /*#__PURE__*/ jsxs("button", {
                type: "button",
                onClick: handleAddOption,
                className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary",
                children: [
                    /*#__PURE__*/ jsx(CirclePlus, {
                        size: 14
                    }),
                    strings.addButton
                ]
            })
        ]
    });
};
const types_CombinatorEditor = CombinatorEditor;
export default types_CombinatorEditor;

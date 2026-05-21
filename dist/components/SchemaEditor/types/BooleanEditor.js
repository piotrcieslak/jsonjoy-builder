import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";
import { useTranslation } from "../../../hooks/use-translation.js";
import { withObjectSchema } from "../../../types/jsonSchema.js";
const BooleanEditor = ({ schema, onChange, schemaKey, onAddEnum, onDeleteEnum, readOnly = false })=>{
    const t = useTranslation();
    const allowTrueId = useId();
    const allowFalseId = useId();
    const enumValues = withObjectSchema(schema, (s)=>s.enum, null);
    const hasRestrictions = Array.isArray(enumValues);
    const allowsTrue = !hasRestrictions || enumValues?.includes(true) || false;
    const allowsFalse = !hasRestrictions || enumValues?.includes(false) || false;
    const handleAllowedChange = (value, allowed)=>{
        let newEnum;
        let enumAction = null;
        if (allowed) {
            if (!hasRestrictions) return;
            if (enumValues?.includes(value)) return;
            newEnum = enumValues ? [
                ...enumValues,
                value
            ] : [
                value
            ];
            enumAction = "add";
            if (newEnum.includes(true) && newEnum.includes(false)) newEnum = void 0;
        } else {
            if (hasRestrictions && !enumValues?.includes(value)) return;
            newEnum = [
                !value
            ];
            enumAction = "delete";
        }
        const updatedValidation = {
            type: "boolean"
        };
        if (newEnum) updatedValidation.enum = newEnum;
        else {
            onChange({
                type: "boolean"
            });
            if ("add" === enumAction) onAddEnum?.({
                value,
                index: enumValues?.length ?? 0,
                schemaKey
            });
            if ("delete" === enumAction) {
                const deleteIndex = enumValues?.indexOf(value) ?? [
                    true,
                    false
                ].indexOf(value);
                onDeleteEnum?.({
                    value,
                    index: Math.max(deleteIndex, 0),
                    schemaKey
                });
            }
            return;
        }
        onChange(updatedValidation);
        if ("add" === enumAction) onAddEnum?.({
            value,
            index: newEnum.indexOf(value),
            schemaKey
        });
        if ("delete" === enumAction) {
            const deleteIndex = enumValues?.indexOf(value) ?? [
                true,
                false
            ].indexOf(value);
            onDeleteEnum?.({
                value,
                index: Math.max(deleteIndex, 0),
                schemaKey
            });
        }
    };
    const hasEnum = enumValues && enumValues.length > 0;
    return /*#__PURE__*/ jsxs("div", {
        className: "space-y-4",
        children: [
            readOnly && !hasEnum && /*#__PURE__*/ jsx("p", {
                className: "text-sm text-muted-foreground italic",
                children: t.booleanNoConstraint
            }),
            (!readOnly || !allowsTrue || !allowsFalse) && /*#__PURE__*/ jsxs("div", {
                className: "space-y-2 pt-2",
                children: [
                    (!readOnly || hasEnum) && /*#__PURE__*/ jsxs(Fragment, {
                        children: [
                            /*#__PURE__*/ jsx(Label, {
                                children: t.booleanAllowedValuesLabel
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ jsxs("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ jsx(Switch, {
                                                id: allowTrueId,
                                                checked: allowsTrue,
                                                disabled: readOnly,
                                                onCheckedChange: (checked)=>handleAllowedChange(true, checked)
                                            }),
                                            /*#__PURE__*/ jsx(Label, {
                                                htmlFor: allowTrueId,
                                                className: "cursor-pointer",
                                                children: t.booleanAllowTrueLabel
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ jsxs("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ jsx(Switch, {
                                                id: allowFalseId,
                                                checked: allowsFalse,
                                                disabled: readOnly,
                                                onCheckedChange: (checked)=>handleAllowedChange(false, checked)
                                            }),
                                            /*#__PURE__*/ jsx(Label, {
                                                htmlFor: allowFalseId,
                                                className: "cursor-pointer",
                                                children: t.booleanAllowFalseLabel
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    !allowsTrue && !allowsFalse && /*#__PURE__*/ jsx("p", {
                        className: "text-xs text-amber-600 mt-2",
                        children: t.booleanNeitherWarning
                    })
                ]
            })
        ]
    });
};
const types_BooleanEditor = BooleanEditor;
export default types_BooleanEditor;

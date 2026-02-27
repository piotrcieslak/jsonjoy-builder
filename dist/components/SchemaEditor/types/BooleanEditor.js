import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";
import { useTranslation } from "../../../hooks/use-translation.js";
import { withObjectSchema } from "../../../types/jsonSchema.js";
const BooleanEditor = ({ schema, onChange, readOnly = false })=>{
    const t = useTranslation();
    const allowTrueId = useId();
    const allowFalseId = useId();
    const enumValues = withObjectSchema(schema, (s)=>s.enum, null);
    const hasRestrictions = Array.isArray(enumValues);
    const allowsTrue = !hasRestrictions || enumValues?.includes(true) || false;
    const allowsFalse = !hasRestrictions || enumValues?.includes(false) || false;
    const handleAllowedChange = (value, allowed)=>{
        let newEnum;
        if (allowed) {
            if (!hasRestrictions) return;
            if (enumValues?.includes(value)) return;
            newEnum = enumValues ? [
                ...enumValues,
                value
            ] : [
                value
            ];
            if (newEnum.includes(true) && newEnum.includes(false)) newEnum = void 0;
        } else {
            if (hasRestrictions && !enumValues?.includes(value)) return;
            newEnum = [
                !value
            ];
        }
        const updatedValidation = {
            type: "boolean"
        };
        if (!newEnum) return void onChange({
            type: "boolean"
        });
        updatedValidation.enum = newEnum;
        onChange(updatedValidation);
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
export { types_BooleanEditor as default };

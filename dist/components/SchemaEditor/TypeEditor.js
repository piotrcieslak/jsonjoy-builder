import { jsx, jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import { useTranslation } from "../../hooks/use-translation.js";
import { withObjectSchema } from "../../types/jsonSchema.js";
const StringEditor = /*#__PURE__*/ lazy(()=>import("./types/StringEditor.js"));
const NumberEditor = /*#__PURE__*/ lazy(()=>import("./types/NumberEditor.js"));
const BooleanEditor = /*#__PURE__*/ lazy(()=>import("./types/BooleanEditor.js"));
const ObjectEditor = /*#__PURE__*/ lazy(()=>import("./types/ObjectEditor.js"));
const ArrayEditor = /*#__PURE__*/ lazy(()=>import("./types/ArrayEditor.js"));
const TypeEditor = ({ schema, validationNode, onChange, depth = 0, readOnly = false })=>{
    const t = useTranslation();
    const type = withObjectSchema(schema, (s)=>s.type || "object", "string");
    return /*#__PURE__*/ jsxs(Suspense, {
        fallback: /*#__PURE__*/ jsx("div", {
            children: t.schemaEditorLoading
        }),
        children: [
            "string" === type && /*#__PURE__*/ jsx(StringEditor, {
                readOnly: readOnly,
                schema: schema,
                onChange: onChange,
                depth: depth,
                validationNode: validationNode
            }),
            "number" === type && /*#__PURE__*/ jsx(NumberEditor, {
                readOnly: readOnly,
                schema: schema,
                onChange: onChange,
                depth: depth,
                validationNode: validationNode
            }),
            "integer" === type && /*#__PURE__*/ jsx(NumberEditor, {
                readOnly: readOnly,
                schema: schema,
                onChange: onChange,
                depth: depth,
                validationNode: validationNode,
                integer: true
            }),
            "boolean" === type && /*#__PURE__*/ jsx(BooleanEditor, {
                readOnly: readOnly,
                schema: schema,
                onChange: onChange,
                depth: depth,
                validationNode: validationNode
            }),
            "object" === type && /*#__PURE__*/ jsx(ObjectEditor, {
                readOnly: readOnly,
                schema: schema,
                onChange: onChange,
                depth: depth,
                validationNode: validationNode
            }),
            "array" === type && /*#__PURE__*/ jsx(ArrayEditor, {
                readOnly: readOnly,
                schema: schema,
                onChange: onChange,
                depth: depth,
                validationNode: validationNode
            })
        ]
    });
};
const SchemaEditor_TypeEditor = TypeEditor;
export { SchemaEditor_TypeEditor as default };

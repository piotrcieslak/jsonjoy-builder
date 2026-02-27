import { jsx, jsxs } from "react/jsx-runtime";
import { useTranslation } from "../../hooks/use-translation.js";
import { createFieldSchema, renameObjectProperty, updateObjectProperty, updatePropertyRequired } from "../../lib/schemaEditor.js";
import { asObjectSchema, isBooleanSchema } from "../../types/jsonSchema.js";
import AddFieldButton from "./AddFieldButton.js";
import SchemaFieldList from "./SchemaFieldList.js";
import handlePropertyToggle from "./utils/handlePropertyToggle.js";
const SchemaVisualEditor = ({ schema, onChange, readOnly = false })=>{
    const t = useTranslation();
    const handleAddField = (newField, isPatternProperty = false)=>{
        const fieldSchema = createFieldSchema(newField);
        let newSchema = updateObjectProperty(asObjectSchema(schema), newField.name, fieldSchema, isPatternProperty);
        if (newField.required) newSchema = updatePropertyRequired(newSchema, newField.name, true);
        onChange(newSchema);
    };
    const handleEditField = (name, updatedField, isPatternProperty = false)=>{
        const fieldSchema = createFieldSchema(updatedField);
        let newSchema = asObjectSchema(schema);
        if (name !== updatedField.name) {
            newSchema = renameObjectProperty(newSchema, name, updatedField.name, isPatternProperty);
            newSchema = updateObjectProperty(newSchema, updatedField.name, fieldSchema, isPatternProperty);
        } else newSchema = updateObjectProperty(newSchema, name, fieldSchema, isPatternProperty);
        newSchema = updatePropertyRequired(newSchema, updatedField.name, updatedField.required || false);
        onChange(newSchema);
    };
    const handleDeleteField = (name, isPatternProperty = false)=>{
        const schemaProperty = isPatternProperty ? "patternProperties" : "properties";
        if (isBooleanSchema(schema) || !schema[schemaProperty]) return;
        const { [name]: _, ...remainingProps } = schema[schemaProperty];
        const newSchema = {
            ...schema,
            [schemaProperty]: remainingProps
        };
        if (newSchema.required) newSchema.required = newSchema.required.filter((field)=>field !== name);
        onChange(newSchema);
    };
    const hasObjectSchema = !isBooleanSchema(schema);
    const hasProperties = hasObjectSchema && schema.properties && Object.keys(schema.properties).length > 0;
    const hasPropertiesFields = hasObjectSchema && schema.patternProperties && Object.keys(schema.patternProperties).length > 0;
    const hasFields = hasProperties || hasPropertiesFields;
    return /*#__PURE__*/ jsxs("div", {
        className: "p-4 h-full flex flex-col overflow-auto jsonjoy",
        children: [
            !readOnly && /*#__PURE__*/ jsx("div", {
                className: "mb-6 shrink-0",
                children: /*#__PURE__*/ jsx(AddFieldButton, {
                    onAddField: handleAddField
                })
            }),
            /*#__PURE__*/ jsx("div", {
                className: "grow overflow-auto",
                children: hasFields ? /*#__PURE__*/ jsx(SchemaFieldList, {
                    schema: schema,
                    readOnly: readOnly,
                    onAddField: handleAddField,
                    onEditField: handleEditField,
                    onDeleteField: handleDeleteField,
                    onPropertyToggle: (name, isPatternProperty)=>handlePropertyToggle(onChange, schema, name, isPatternProperty)
                }) : /*#__PURE__*/ jsxs("div", {
                    className: "text-center py-10 text-muted-foreground",
                    children: [
                        /*#__PURE__*/ jsx("p", {
                            className: "mb-3",
                            children: t.visualEditorNoFieldsHint1
                        }),
                        /*#__PURE__*/ jsx("p", {
                            className: "text-sm",
                            children: t.visualEditorNoFieldsHint2
                        })
                    ]
                })
            })
        ]
    });
};
const SchemaEditor_SchemaVisualEditor = SchemaVisualEditor;
export { SchemaEditor_SchemaVisualEditor as default };

import { jsx, jsxs } from "react/jsx-runtime";
import { useTranslation } from "../../hooks/use-translation.js";
import { createFieldSchema, removeObjectPatternProperty, removeObjectProperty, renameObjectPatternProperty, renameObjectProperty, updateObjectPatternProperty, updateObjectProperty, updatePropertyRequired } from "../../lib/schemaEditor.js";
import { asObjectSchema, isBooleanSchema } from "../../types/jsonSchema.js";
import AddFieldButton from "./AddFieldButton.js";
import SchemaFieldList from "./SchemaFieldList.js";
const SchemaVisualEditor = ({ schema, onChange, onAddEnum, onDeleteEnum, readOnly = false, autoFocus = true })=>{
    const t = useTranslation();
    const handleAddField = (newField)=>{
        const fieldSchema = createFieldSchema(newField);
        let newSchema = updateObjectProperty(asObjectSchema(schema), newField.name, fieldSchema);
        if (newField.required) newSchema = updatePropertyRequired(newSchema, newField.name, true);
        onChange(newSchema);
    };
    const handleAddPatternField = (newField)=>{
        onChange(updateObjectPatternProperty(asObjectSchema(schema), newField.name, createFieldSchema(newField)));
    };
    const handleEditField = (name, updatedField)=>{
        const fieldSchema = createFieldSchema(updatedField);
        let newSchema = asObjectSchema(schema);
        if (name !== updatedField.name) {
            newSchema = renameObjectProperty(newSchema, name, updatedField.name);
            newSchema = updateObjectProperty(newSchema, updatedField.name, fieldSchema);
        } else newSchema = updateObjectProperty(newSchema, name, fieldSchema);
        newSchema = updatePropertyRequired(newSchema, updatedField.name, updatedField.required || false);
        onChange(newSchema);
    };
    const handleEditPatternField = (name, updatedField)=>{
        const fieldSchema = createFieldSchema(updatedField);
        let newSchema = asObjectSchema(schema);
        if (name !== updatedField.name) {
            newSchema = renameObjectPatternProperty(newSchema, name, updatedField.name);
            newSchema = updateObjectPatternProperty(newSchema, updatedField.name, fieldSchema);
        } else newSchema = updateObjectPatternProperty(newSchema, name, fieldSchema);
        onChange(newSchema);
    };
    const handleDeleteField = (name)=>{
        onChange(removeObjectProperty(asObjectSchema(schema), name));
    };
    const handleDeletePatternField = (name)=>{
        onChange(removeObjectPatternProperty(asObjectSchema(schema), name));
    };
    const hasFields = !isBooleanSchema(schema) && (schema.properties && Object.keys(schema.properties).length > 0 || schema.patternProperties && Object.keys(schema.patternProperties).length > 0);
    return /*#__PURE__*/ jsxs("div", {
        className: "p-4 h-full flex flex-col overflow-auto jsonjoy",
        children: [
            !readOnly && /*#__PURE__*/ jsx("div", {
                className: "mb-6 shrink-0",
                children: /*#__PURE__*/ jsx(AddFieldButton, {
                    onAddField: handleAddField,
                    onAddPatternField: handleAddPatternField,
                    autoFocus: autoFocus
                })
            }),
            /*#__PURE__*/ jsx("div", {
                className: "grow overflow-auto",
                children: hasFields ? /*#__PURE__*/ jsx(SchemaFieldList, {
                    schema: schema,
                    readOnly: readOnly,
                    onAddEnum: onAddEnum,
                    onDeleteEnum: onDeleteEnum,
                    onEditField: handleEditField,
                    onDeleteField: handleDeleteField,
                    onEditPatternField: handleEditPatternField,
                    onDeletePatternField: handleDeletePatternField,
                    autoFocus: autoFocus
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
export default SchemaEditor_SchemaVisualEditor;

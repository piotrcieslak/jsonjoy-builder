import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useTranslation } from "../../hooks/use-translation.js";
import { getSchemaProperties } from "../../lib/schemaEditor.js";
import { buildValidationTree } from "../../types/validation.js";
import SchemaPropertyEditor from "./SchemaPropertyEditor.js";
const SchemaFieldList = ({ schema, onEditField, onDeleteField, onPropertyToggle, readOnly = false })=>{
    const t = useTranslation();
    const properties = getSchemaProperties(schema);
    const patternProperties = getSchemaProperties(schema, true);
    const getValidSchemaType = (propSchema)=>{
        if ("boolean" == typeof propSchema) return "object";
        const type = propSchema.type;
        if (Array.isArray(type)) return type[0] || "object";
        return type || "object";
    };
    const handleNameChange = (oldName, newName, isPatternProperty = false)=>{
        const schemaProperties = isPatternProperty ? patternProperties : properties;
        const property = schemaProperties.find((prop)=>prop.name === oldName);
        if (!property) return;
        onEditField(oldName, {
            name: newName,
            type: getValidSchemaType(property.schema),
            description: "boolean" == typeof property.schema ? "" : property.schema.description || "",
            required: property.required,
            validation: "boolean" == typeof property.schema ? {
                type: "object"
            } : property.schema
        }, isPatternProperty);
    };
    const handleRequiredChange = (name, required)=>{
        const property = properties.find((prop)=>prop.name === name);
        if (!property) return;
        onEditField(name, {
            name,
            type: getValidSchemaType(property.schema),
            description: "boolean" == typeof property.schema ? "" : property.schema.description || "",
            required,
            validation: "boolean" == typeof property.schema ? {
                type: "object"
            } : property.schema
        });
    };
    const handleSchemaChange = (name, updatedSchema, isPatternProperty = false)=>{
        const schemaProperties = isPatternProperty ? patternProperties : properties;
        const property = schemaProperties.find((prop)=>prop.name === name);
        if (!property) return;
        const type = updatedSchema.type || "object";
        const validType = Array.isArray(type) ? type[0] || "object" : type;
        onEditField(name, {
            name,
            type: validType,
            description: updatedSchema.description || "",
            required: property.required,
            validation: updatedSchema
        }, isPatternProperty);
    };
    const validationTree = useMemo(()=>buildValidationTree(schema, t), [
        schema,
        t
    ]);
    return /*#__PURE__*/ jsxs("div", {
        className: "space-y-2 animate-in",
        children: [
            properties.length > 0 ? /*#__PURE__*/ jsxs("h3", {
                children: [
                    t.regularPropertiesTitle,
                    ":"
                ]
            }) : null,
            properties.map((property)=>/*#__PURE__*/ jsx(SchemaPropertyEditor, {
                    name: property.name,
                    schema: property.schema,
                    required: property.required,
                    validationNode: validationTree.children[property.name] ?? void 0,
                    onDelete: ()=>onDeleteField(property.name),
                    onNameChange: (newName)=>handleNameChange(property.name, newName),
                    onRequiredChange: (required)=>handleRequiredChange(property.name, required),
                    onSchemaChange: (schema)=>handleSchemaChange(property.name, schema),
                    readOnly: readOnly,
                    onPropertyToggle: onPropertyToggle
                }, property.name)),
            patternProperties.length > 0 ? /*#__PURE__*/ jsxs("h3", {
                children: [
                    t.patternPropertiesTitle,
                    ":"
                ]
            }) : null,
            patternProperties.map((property)=>/*#__PURE__*/ jsx(SchemaPropertyEditor, {
                    name: property.name,
                    schema: property.schema,
                    required: property.required,
                    validationNode: validationTree.children[property.name] ?? void 0,
                    onDelete: ()=>onDeleteField(property.name, true),
                    onNameChange: (newName)=>handleNameChange(property.name, newName, true),
                    onRequiredChange: (required)=>handleRequiredChange(property.name, required),
                    onSchemaChange: (schema)=>handleSchemaChange(property.name, schema, true),
                    readOnly: readOnly,
                    onPropertyToggle: onPropertyToggle,
                    isPatternProperty: true
                }, property.name))
        ]
    });
};
const SchemaEditor_SchemaFieldList = SchemaFieldList;
export { SchemaEditor_SchemaFieldList as default };

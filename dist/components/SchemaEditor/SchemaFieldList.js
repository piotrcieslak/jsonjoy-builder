import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { useTranslation } from "../../hooks/use-translation.js";
import { getSchemaPatternProperties, getSchemaProperties } from "../../lib/schemaEditor.js";
import { isAllOfSchema, isAnyOfSchema, isOneOfSchema } from "../../types/jsonSchema.js";
import { buildValidationTree } from "../../types/validation.js";
import SchemaPropertyRows from "./SchemaPropertyRows.js";
const SchemaFieldList = ({ schema, onEditField, onDeleteField, onEditPatternField, onDeletePatternField, onAddEnum, onDeleteEnum, readOnly = false, autoFocus = true })=>{
    const t = useTranslation();
    const properties = getSchemaProperties(schema);
    const patternProperties = getSchemaPatternProperties(schema);
    const getValidSchemaType = (propSchema)=>{
        if ("boolean" == typeof propSchema) return "object";
        if (isAnyOfSchema(propSchema) || isOneOfSchema(propSchema) || isAllOfSchema(propSchema)) return "object";
        const type = propSchema.type;
        if (Array.isArray(type)) return type[0] || "object";
        return type || "object";
    };
    const createUpdatedField = (property, overrides = {})=>({
            name: property.name,
            type: getValidSchemaType(property.schema),
            description: "boolean" == typeof property.schema ? "" : property.schema.description || "",
            required: property.required,
            validation: "boolean" == typeof property.schema ? {
                type: "object"
            } : property.schema,
            ...overrides
        });
    const updateProperty = (schemaProperties, name, editField, overrides)=>{
        const property = schemaProperties.find((prop)=>prop.name === name);
        if (!property) return;
        editField(name, createUpdatedField(property, overrides));
    };
    const handleNameChange = (schemaProperties, editField, oldName, newName)=>{
        updateProperty(schemaProperties, oldName, editField, {
            name: newName
        });
    };
    const handleRequiredChange = (name, required)=>{
        updateProperty(properties, name, onEditField, {
            required
        });
    };
    const createFieldForSchemaChange = (property, updatedSchema)=>{
        if (isAnyOfSchema(updatedSchema) || isOneOfSchema(updatedSchema) || isAllOfSchema(updatedSchema)) return createUpdatedField(property, {
            type: "object",
            description: updatedSchema.description || "",
            validation: updatedSchema
        });
        const type = updatedSchema.type || "object";
        const validType = Array.isArray(type) ? type[0] || "object" : type;
        return createUpdatedField(property, {
            type: validType,
            description: updatedSchema.description || "",
            validation: updatedSchema
        });
    };
    const handleSchemaChange = (schemaProperties, editField, name, updatedSchema)=>{
        const property = schemaProperties.find((prop)=>prop.name === name);
        if (!property) return;
        editField(name, createFieldForSchemaChange(property, updatedSchema));
    };
    const validationTree = useMemo(()=>buildValidationTree(schema, t), [
        schema,
        t
    ]);
    return /*#__PURE__*/ jsx("div", {
        className: "space-y-2 animate-in",
        children: /*#__PURE__*/ jsx(SchemaPropertyRows, {
            properties: properties,
            patternProperties: patternProperties,
            validationChildren: validationTree.children,
            onAddEnum: onAddEnum,
            onDeleteEnum: onDeleteEnum,
            onDelete: onDeleteField,
            onDeletePattern: onDeletePatternField,
            onNameChange: (oldName, newName)=>handleNameChange(properties, onEditField, oldName, newName),
            onPatternNameChange: (oldName, newName)=>handleNameChange(patternProperties, onEditPatternField, oldName, newName),
            onRequiredChange: handleRequiredChange,
            onSchemaChange: (name, updatedSchema)=>handleSchemaChange(properties, onEditField, name, updatedSchema),
            onPatternSchemaChange: (name, updatedSchema)=>handleSchemaChange(patternProperties, onEditPatternField, name, updatedSchema),
            readOnly: readOnly,
            autoFocus: autoFocus
        })
    });
};
const SchemaEditor_SchemaFieldList = SchemaFieldList;
export default SchemaEditor_SchemaFieldList;

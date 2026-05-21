import { jsx, jsxs } from "react/jsx-runtime";
import { useTranslation } from "../../../hooks/use-translation.js";
import { getSchemaPatternProperties, getSchemaProperties, removeObjectPatternProperty, removeObjectProperty, renameObjectPatternProperty, renameObjectProperty, updateObjectPatternProperty, updateObjectProperty, updatePropertyRequired } from "../../../lib/schemaEditor.js";
import { asObjectSchema, isBooleanSchema } from "../../../types/jsonSchema.js";
import { ButtonToggle } from "../../ui/button-toggle.js";
import AddFieldButton from "../AddFieldButton.js";
import SchemaPropertyRows from "../SchemaPropertyRows.js";
const ObjectEditor = ({ schema, validationNode, onChange, schemaKey, onAddEnum, onDeleteEnum, depth = 0, readOnly = false })=>{
    const t = useTranslation();
    const properties = getSchemaProperties(schema);
    const patternProperties = getSchemaPatternProperties(schema);
    const normalizedSchema = isBooleanSchema(schema) ? {
        type: "object",
        properties: {}
    } : {
        ...schema,
        type: "object",
        properties: schema.properties || {}
    };
    const { additionalProperties } = normalizedSchema;
    const createPropertySchema = (newField)=>{
        const { type, description, validation, additionalProperties } = newField;
        return {
            type,
            description: description || void 0,
            ...validation || {},
            ...false === additionalProperties ? {
                additionalProperties
            } : {}
        };
    };
    const handleAddProperty = (newField)=>{
        const fieldSchema = createPropertySchema(newField);
        let newSchema = updateObjectProperty(normalizedSchema, newField.name, fieldSchema);
        if (newField.required) newSchema = updatePropertyRequired(newSchema, newField.name, true);
        onChange(newSchema);
    };
    const handleAddPatternProperty = (newField)=>{
        onChange(updateObjectPatternProperty(normalizedSchema, newField.name, createPropertySchema(newField)));
    };
    const handleDeleteProperty = (propertyName)=>{
        const newSchema = removeObjectProperty(normalizedSchema, propertyName);
        onChange(newSchema);
    };
    const handleDeletePatternProperty = (propertyName)=>{
        const newSchema = removeObjectPatternProperty(normalizedSchema, propertyName);
        onChange(newSchema);
    };
    const handlePropertyNameChange = (oldName, newName)=>{
        if (oldName === newName) return;
        const property = properties.find((p)=>p.name === oldName);
        if (!property) return;
        onChange(renameObjectProperty(normalizedSchema, oldName, newName));
    };
    const handlePatternPropertyNameChange = (oldName, newName)=>{
        if (oldName === newName) return;
        const property = patternProperties.find((p)=>p.name === oldName);
        if (!property) return;
        onChange(renameObjectPatternProperty(normalizedSchema, oldName, newName));
    };
    const handlePropertyRequiredChange = (propertyName, required)=>{
        const newSchema = updatePropertyRequired(normalizedSchema, propertyName, required);
        onChange(newSchema);
    };
    const handlePropertySchemaChange = (propertyName, propertySchema)=>{
        const newSchema = updateObjectProperty(normalizedSchema, propertyName, propertySchema);
        onChange(newSchema);
    };
    const handlePatternPropertySchemaChange = (propertyName, propertySchema)=>{
        const newSchema = updateObjectPatternProperty(normalizedSchema, propertyName, propertySchema);
        onChange(newSchema);
    };
    const handleAdditionalPropertiesToggle = ()=>{
        const { additionalProperties, ...restOfSchema } = normalizedSchema;
        const updatedSchema = asObjectSchema(restOfSchema);
        if (false !== additionalProperties) updatedSchema.additionalProperties = false;
        onChange(updatedSchema);
    };
    return /*#__PURE__*/ jsxs("div", {
        className: "space-y-4",
        children: [
            properties.length > 0 || patternProperties.length > 0 ? /*#__PURE__*/ jsx("div", {
                className: "space-y-2",
                children: /*#__PURE__*/ jsx(SchemaPropertyRows, {
                    properties: properties,
                    patternProperties: patternProperties,
                    validationChildren: validationNode?.children,
                    onAddEnum: onAddEnum,
                    onDeleteEnum: onDeleteEnum,
                    onDelete: handleDeleteProperty,
                    onDeletePattern: handleDeletePatternProperty,
                    onNameChange: handlePropertyNameChange,
                    onPatternNameChange: handlePatternPropertyNameChange,
                    onRequiredChange: handlePropertyRequiredChange,
                    onSchemaChange: handlePropertySchemaChange,
                    onPatternSchemaChange: handlePatternPropertySchemaChange,
                    schemaKeyPrefix: schemaKey,
                    readOnly: readOnly,
                    depth: depth
                })
            }) : /*#__PURE__*/ jsx("div", {
                className: "text-sm text-muted-foreground italic p-2 text-center border rounded-md",
                children: t.objectPropertiesNone
            }),
            !readOnly && /*#__PURE__*/ jsxs("div", {
                className: "mt-4 flex flex-row gap-x-4",
                children: [
                    /*#__PURE__*/ jsx(AddFieldButton, {
                        onAddField: handleAddProperty,
                        onAddPatternField: handleAddPatternProperty,
                        variant: "secondary"
                    }),
                    /*#__PURE__*/ jsx(ButtonToggle, {
                        onClick: handleAdditionalPropertiesToggle,
                        className: false === additionalProperties ? "bg-amber-50 text-amber-600" : "bg-lime-50 text-lime-600",
                        children: false === additionalProperties ? t.additionalPropertiesForbid : t.additionalPropertiesAllow
                    })
                ]
            })
        ]
    });
};
const types_ObjectEditor = ObjectEditor;
export default types_ObjectEditor;

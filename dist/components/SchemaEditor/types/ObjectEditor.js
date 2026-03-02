import { jsx, jsxs } from "react/jsx-runtime";
import { useTranslation } from "../../../hooks/use-translation.js";
import { getSchemaProperties, removeObjectProperty, updateObjectProperty, updatePropertyRequired } from "../../../lib/schemaEditor.js";
import { asObjectSchema, isBooleanSchema } from "../../../types/jsonSchema.js";
import { ButtonToggle } from "../../ui/button-toggle.js";
import AddFieldButton from "../AddFieldButton.js";
import SchemaPropertyEditor from "../SchemaPropertyEditor.js";
import handlePropertyToggle from "../utils/handlePropertyToggle.js";
const ObjectEditor = ({ schema, validationNode, onChange, depth = 0, readOnly = false })=>{
    const t = useTranslation();
    const properties = getSchemaProperties(schema);
    const patternProperties = getSchemaProperties(schema, true);
    const normalizedSchema = isBooleanSchema(schema) ? {
        type: "object",
        properties: {}
    } : {
        ...schema,
        type: "object",
        properties: schema.properties || {}
    };
    const { additionalProperties } = normalizedSchema;
    const handleAddProperty = (newField, isPatternProperty = false)=>{
        const { type, description, validation, additionalProperties } = newField;
        const fieldSchema = {
            type,
            description: description || void 0,
            ...validation || {},
            ...false === additionalProperties ? {
                additionalProperties
            } : {}
        };
        let newSchema = updateObjectProperty(normalizedSchema, newField.name, fieldSchema, isPatternProperty);
        if (newField.required) newSchema = updatePropertyRequired(newSchema, newField.name, true);
        onChange(newSchema);
    };
    const handleDeleteProperty = (propertyName, isPatternProperty = false)=>{
        const newSchema = removeObjectProperty(normalizedSchema, propertyName, isPatternProperty);
        onChange(newSchema);
    };
    const handlePropertyNameChange = (oldName, newName, isPatternProperty = false)=>{
        if (oldName === newName) return;
        const property = properties.find((p)=>p.name === oldName);
        if (!property) return;
        const propertySchemaObj = asObjectSchema(property.schema);
        let newSchema = updateObjectProperty(normalizedSchema, newName, propertySchemaObj, isPatternProperty);
        if (property.required) newSchema = updatePropertyRequired(newSchema, newName, true);
        newSchema = removeObjectProperty(newSchema, oldName, isPatternProperty);
        onChange(newSchema);
    };
    const handlePropertyRequiredChange = (propertyName, required)=>{
        const newSchema = updatePropertyRequired(normalizedSchema, propertyName, required);
        onChange(newSchema);
    };
    const handlePropertySchemaChange = (propertyName, propertySchema, isPatternProperty = false)=>{
        const newSchema = updateObjectProperty(normalizedSchema, propertyName, propertySchema, isPatternProperty);
        onChange(newSchema);
    };
    const handleAdditionalPropertiesToggle = ()=>{
        const { additionalProperties, ...restOfSchema } = normalizedSchema;
        const updatedSchema = asObjectSchema(restOfSchema);
        if (false !== additionalProperties) updatedSchema.additionalProperties = false;
        onChange(updatedSchema);
    };
    const hasProperties = properties.length > 0 || patternProperties.length > 0;
    return /*#__PURE__*/ jsx("div", {
        className: "space-y-6",
        children: /*#__PURE__*/ jsxs("div", {
            className: "space-y-2",
            children: [
                hasProperties ? /*#__PURE__*/ jsxs("div", {
                    className: "space-y-2",
                    children: [
                        properties.length > 0 ? /*#__PURE__*/ jsxs("h3", {
                            className: "ml-5",
                            children: [
                                t.regularPropertiesTitle,
                                ":"
                            ]
                        }) : null,
                        properties.map((property)=>/*#__PURE__*/ jsx(SchemaPropertyEditor, {
                                readOnly: readOnly,
                                name: property.name,
                                schema: property.schema,
                                required: property.required,
                                validationNode: validationNode?.children[property.name],
                                onDelete: ()=>handleDeleteProperty(property.name),
                                onNameChange: (newName)=>handlePropertyNameChange(property.name, newName),
                                onRequiredChange: (required)=>handlePropertyRequiredChange(property.name, required),
                                onSchemaChange: (schema)=>handlePropertySchemaChange(property.name, schema),
                                depth: depth,
                                onPropertyToggle: (name, isPatternProperty)=>handlePropertyToggle(onChange, normalizedSchema, name, isPatternProperty)
                            }, property.name)),
                        patternProperties.length > 0 ? /*#__PURE__*/ jsxs("h3", {
                            className: "ml-5",
                            children: [
                                t.patternPropertiesTitle,
                                ":"
                            ]
                        }) : null,
                        patternProperties.map((property)=>/*#__PURE__*/ jsx(SchemaPropertyEditor, {
                                readOnly: readOnly,
                                name: property.name,
                                schema: property.schema,
                                required: property.required,
                                validationNode: validationNode?.children[property.name],
                                onDelete: ()=>handleDeleteProperty(property.name, true),
                                onNameChange: (newName)=>handlePropertyNameChange(property.name, newName, true),
                                onRequiredChange: (required)=>handlePropertyRequiredChange(property.name, required),
                                onSchemaChange: (schema)=>handlePropertySchemaChange(property.name, schema, true),
                                depth: depth,
                                onPropertyToggle: (name, isPatternProperty)=>handlePropertyToggle(onChange, normalizedSchema, name, isPatternProperty),
                                isPatternProperty: true
                            }, property.name))
                    ]
                }) : /*#__PURE__*/ jsx("div", {
                    className: "text-sm text-muted-foreground italic p-2 text-center border rounded-md",
                    children: t.objectPropertiesNone
                }),
                /*#__PURE__*/ jsxs("div", {
                    className: "mt-4 flex flex-row gap-x-4",
                    children: [
                        readOnly ? null : /*#__PURE__*/ jsx(AddFieldButton, {
                            onAddField: handleAddProperty,
                            variant: "secondary"
                        }),
                        /*#__PURE__*/ jsx(ButtonToggle, {
                            onClick: handleAdditionalPropertiesToggle,
                            readOnly: readOnly,
                            className: false === additionalProperties ? "bg-amber-50 text-amber-600" : "bg-lime-50 text-lime-600",
                            children: false === additionalProperties ? t.additionalPropertiesForbid : t.additionalPropertiesAllow
                        })
                    ]
                })
            ]
        })
    });
};
const types_ObjectEditor = ObjectEditor;
export { types_ObjectEditor as default };

import { isBooleanSchema, isObjectSchema } from "../types/jsonSchema.js";
function copySchema(schema) {
    if ("function" == typeof structuredClone) return structuredClone(schema);
    return JSON.parse(JSON.stringify(schema));
}
function updateObjectProperty(schema, propertyName, propertySchema, isPatternProperty = false) {
    if (!isObjectSchema(schema)) return schema;
    const newSchema = copySchema(schema);
    if (!newSchema.properties) newSchema.properties = {};
    if (isPatternProperty) {
        if (!newSchema.patternProperties) newSchema.patternProperties = {};
        newSchema.patternProperties[propertyName] = propertySchema;
        return newSchema;
    }
    newSchema.properties[propertyName] = propertySchema;
    return newSchema;
}
function removeObjectProperty(schema, propertyName, isPatternProperty = false) {
    const schemaProperty = isPatternProperty ? "patternProperties" : "properties";
    if (!isObjectSchema(schema) || !schema[schemaProperty]) return schema;
    const newSchema = copySchema(schema);
    const { [propertyName]: _, ...remainingProps } = newSchema[schemaProperty];
    newSchema[schemaProperty] = remainingProps;
    if (newSchema.required) newSchema.required = newSchema.required.filter((name)=>name !== propertyName);
    return newSchema;
}
function updatePropertyRequired(schema, propertyName, required) {
    if (!isObjectSchema(schema)) return schema;
    const newSchema = copySchema(schema);
    if (!newSchema.required) newSchema.required = [];
    if (required) {
        if (!newSchema.required.includes(propertyName)) newSchema.required.push(propertyName);
    } else newSchema.required = newSchema.required.filter((name)=>name !== propertyName);
    return newSchema;
}
function updateArrayItems(schema, itemsSchema) {
    if (isObjectSchema(schema) && "array" === schema.type) return {
        ...schema,
        items: itemsSchema
    };
    return schema;
}
function createFieldSchema(field) {
    const { type, description, validation, additionalProperties } = field;
    if (isObjectSchema(validation)) return {
        type,
        description,
        ...validation,
        ...false === additionalProperties ? {
            additionalProperties
        } : {}
    };
    return validation;
}
function validateFieldName(name) {
    if (!name || "" === name.trim()) return false;
    const validNamePattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    return validNamePattern.test(name);
}
function getSchemaProperties(schema, isPatternProperty = false) {
    const schemaProperty = isPatternProperty ? "patternProperties" : "properties";
    if (!isObjectSchema(schema) || !schema[schemaProperty]) return [];
    const required = schema.required || [];
    return Object.entries(schema[schemaProperty]).map(([name, propSchema])=>({
            name,
            schema: propSchema,
            required: required.includes(name)
        }));
}
function getArrayItemsSchema(schema) {
    if (isBooleanSchema(schema)) return null;
    if ("array" !== schema.type) return null;
    return schema.items || null;
}
function renameObjectProperty(schema, oldName, newName, isPatternProperty = false) {
    const schemaProperty = isPatternProperty ? "patternProperties" : "properties";
    if (!isObjectSchema(schema) || !schema[schemaProperty]) return schema;
    const newSchema = copySchema(schema);
    const newProperties = {};
    for (const [key, value] of Object.entries(newSchema[schemaProperty]))if (key === oldName) newProperties[newName] = value;
    else newProperties[key] = value;
    newSchema[schemaProperty] = newProperties;
    if (newSchema.required) newSchema.required = newSchema.required.map((field)=>field === oldName ? newName : field);
    return newSchema;
}
function hasChildren(schema) {
    if (!isObjectSchema(schema)) return false;
    if ("object" === schema.type && schema.properties) return Object.keys(schema.properties).length > 0;
    if ("array" === schema.type && schema.items && isObjectSchema(schema.items)) return "object" === schema.items.type && !!schema.items.properties;
    return false;
}
function getSchemaPatternProperties(schema) {
    if (!isObjectSchema(schema) || !schema.patternProperties) return [];
    return Object.entries(schema.patternProperties).map(([pattern, propSchema])=>({
            pattern,
            schema: propSchema
        }));
}
function validateRegexPattern(pattern) {
    if (!pattern || "" === pattern.trim()) return {
        valid: false,
        error: "Pattern cannot be empty"
    };
    try {
        new RegExp(pattern);
        return {
            valid: true
        };
    } catch (e) {
        return {
            valid: false,
            error: `Invalid regex: ${e.message}`
        };
    }
}
export { copySchema, createFieldSchema, getArrayItemsSchema, getSchemaPatternProperties, getSchemaProperties, hasChildren, removeObjectProperty, renameObjectProperty, updateArrayItems, updateObjectProperty, updatePropertyRequired, validateFieldName, validateRegexPattern };

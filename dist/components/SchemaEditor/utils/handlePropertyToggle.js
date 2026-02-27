import { removeObjectProperty, updateObjectProperty } from "../../../lib/schemaEditor.js";
import { isBooleanSchema } from "../../../types/jsonSchema.js";
const handlePropertyToggle = (onChange, schema, name, isPatternProperty = false)=>{
    const schemaProperty = isPatternProperty ? "patternProperties" : "properties";
    if (isBooleanSchema(schema) || !schema[schemaProperty]) return;
    const fieldSchema = schema[schemaProperty][name];
    const schemaAfterRemove = removeObjectProperty(schema, name, isPatternProperty);
    const newSchema = updateObjectProperty(schemaAfterRemove, name, fieldSchema, !isPatternProperty);
    onChange(newSchema);
};
const utils_handlePropertyToggle = handlePropertyToggle;
export { utils_handlePropertyToggle as default };

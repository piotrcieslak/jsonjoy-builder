import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import SchemaPropertyEditor, { PatternSchemaPropertyEditor } from "./SchemaPropertyEditor.js";
const getSchemaKey = (prefix, name)=>prefix ? `${prefix}.${name}` : name;
const SchemaPropertyRows = ({ properties, patternProperties, readOnly, autoFocus, depth = 0, schemaKeyPrefix, validationChildren, onAddEnum, onDeleteEnum, onDelete, onDeletePattern, onNameChange, onPatternNameChange, onRequiredChange, onSchemaChange, onPatternSchemaChange })=>/*#__PURE__*/ jsxs(Fragment, {
        children: [
            properties.map((property)=>/*#__PURE__*/ jsx(SchemaPropertyEditor, {
                    readOnly: readOnly,
                    name: property.name,
                    schemaKey: getSchemaKey(schemaKeyPrefix, property.name),
                    schema: property.schema,
                    required: property.required,
                    validationNode: validationChildren?.[property.name],
                    onAddEnum: onAddEnum,
                    onDeleteEnum: onDeleteEnum,
                    onDelete: ()=>onDelete(property.name),
                    onNameChange: (newName)=>onNameChange(property.name, newName),
                    onRequiredChange: (required)=>onRequiredChange(property.name, required),
                    onSchemaChange: (schema)=>onSchemaChange(property.name, schema),
                    depth: depth,
                    autoFocus: autoFocus
                }, property.name)),
            patternProperties.map((property)=>/*#__PURE__*/ jsx(PatternSchemaPropertyEditor, {
                    readOnly: readOnly,
                    name: property.name,
                    schemaKey: getSchemaKey(schemaKeyPrefix, property.name),
                    schema: property.schema,
                    validationNode: validationChildren?.[`pattern:${property.name}`],
                    onAddEnum: onAddEnum,
                    onDeleteEnum: onDeleteEnum,
                    onDelete: ()=>onDeletePattern(property.name),
                    onNameChange: (newName)=>onPatternNameChange(property.name, newName),
                    onSchemaChange: (schema)=>onPatternSchemaChange(property.name, schema),
                    depth: depth,
                    autoFocus: autoFocus
                }, `pattern:${property.name}`))
        ]
    });
const SchemaEditor_SchemaPropertyRows = SchemaPropertyRows;
export default SchemaEditor_SchemaPropertyRows;

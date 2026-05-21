import zod from "zod";
import { baseSchema } from "./jsonSchema.js";
function refineRangeConsistency(min, isMinExclusive, max, isMaxExclusive) {
    if (void 0 !== min && void 0 !== max && min > max) return false;
    if (isMinExclusive && isMaxExclusive && max - min < 2) return false;
    if ((isMinExclusive || isMaxExclusive) && max - min < 1) return false;
    return true;
}
const getJsonStringType = (t)=>zod.object({
        minLength: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional(),
        maxLength: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional(),
        pattern: baseSchema.shape.pattern,
        format: baseSchema.shape.format,
        enum: baseSchema.shape["enum"],
        contentMediaType: baseSchema.shape.contentMediaType,
        contentEncoding: baseSchema.shape.contentEncoding
    }).refine(({ minLength, maxLength })=>refineRangeConsistency(minLength, false, maxLength, false), {
        message: t.stringValidationErrorLengthRange,
        path: [
            "length"
        ]
    });
const getJsonNumberType = (t)=>zod.object({
        multipleOf: zod.number().positive({
            message: t.typeValidationErrorPositive
        }).optional(),
        minimum: baseSchema.shape.minimum,
        maximum: baseSchema.shape.maximum,
        exclusiveMinimum: baseSchema.shape.exclusiveMinimum,
        exclusiveMaximum: baseSchema.shape.exclusiveMaximum,
        enum: baseSchema.shape["enum"]
    }).refine(({ minimum, exclusiveMinimum, maximum, exclusiveMaximum })=>refineRangeConsistency(minimum, false, maximum, false) && refineRangeConsistency(minimum, false, exclusiveMaximum, true) && refineRangeConsistency(exclusiveMinimum, true, maximum, false) && refineRangeConsistency(exclusiveMinimum, true, exclusiveMaximum, true), {
        message: t.numberValidationErrorMinMax,
        path: [
            "minMax"
        ]
    }).refine(({ minimum, exclusiveMinimum })=>void 0 === exclusiveMinimum || void 0 === minimum, {
        message: t.numberValidationErrorBothExclusiveAndInclusiveMin,
        path: [
            "redundantMinimum"
        ]
    }).refine(({ maximum, exclusiveMaximum })=>void 0 === exclusiveMaximum || void 0 === maximum, {
        message: t.numberValidationErrorBothExclusiveAndInclusiveMax,
        path: [
            "redundantMaximum"
        ]
    }).refine(({ enum: enumValues, minimum, maximum, exclusiveMinimum, exclusiveMaximum })=>{
        if (!enumValues || 0 === enumValues.length) return true;
        return enumValues.every((val)=>{
            if ("number" != typeof val) return false;
            if (void 0 !== minimum && val < minimum) return false;
            if (void 0 !== maximum && val > maximum) return false;
            if (void 0 !== exclusiveMinimum && val <= exclusiveMinimum) return false;
            if (void 0 !== exclusiveMaximum && val >= exclusiveMaximum) return false;
            return true;
        });
    }, {
        message: t.numberValidationErrorEnumOutOfRange,
        path: [
            "enum"
        ]
    });
const getJsonArrayType = (t)=>zod.object({
        minItems: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional(),
        maxItems: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional(),
        uniqueItems: zod.boolean().optional(),
        minContains: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional(),
        maxContains: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional()
    }).refine(({ minItems, maxItems })=>refineRangeConsistency(minItems, false, maxItems, false), {
        message: t.arrayValidationErrorMinMax,
        path: [
            "minmax"
        ]
    }).refine(({ minContains, maxContains })=>refineRangeConsistency(minContains, false, maxContains, false), {
        message: t.arrayValidationErrorContainsMinMax,
        path: [
            "minmaxContains"
        ]
    });
const getJsonObjectType = (t)=>zod.object({
        minProperties: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional(),
        maxProperties: zod.number().int({
            message: t.typeValidationErrorIntValue
        }).min(0, {
            message: t.typeValidationErrorNegativeLength
        }).optional()
    }).refine(({ minProperties, maxProperties })=>refineRangeConsistency(minProperties, false, maxProperties, false), {
        message: t.objectValidationErrorMinMax,
        path: [
            "minmax"
        ]
    });
function getTypeValidation(type, t) {
    const jsonTypesValidation = {
        string: getJsonStringType(t),
        number: getJsonNumberType(t),
        array: getJsonArrayType(t),
        object: getJsonObjectType(t)
    };
    return jsonTypesValidation[type] || zod.any();
}
function validateSchemaByType(schema, type, t) {
    const zodSchema = getTypeValidation(type, t);
    const result = zodSchema.safeParse(schema);
    if (result.success) return {
        success: true
    };
    return {
        success: false,
        errors: result.error.issues
    };
}
function buildValidationTree(schema, t) {
    const deriveType = (sch)=>{
        if (!sch || "object" != typeof sch) return;
        const declared = sch.type;
        if ("string" == typeof declared) return declared;
        if (Array.isArray(declared) && declared.length > 0 && "string" == typeof declared[0]) return declared[0];
    };
    if ("boolean" == typeof schema) {
        const validation = true === schema ? {
            success: true
        } : {
            success: false,
            errors: [
                {
                    code: "custom",
                    message: t.validatorErrorSchemaValidation,
                    path: []
                }
            ]
        };
        const node = {
            name: String(schema),
            validation,
            children: {},
            cumulativeChildrenErrors: validation.success ? 0 : validation.errors?.length ?? 0
        };
        return node;
    }
    const sch = schema;
    const currentType = deriveType(sch);
    const validation = validateSchemaByType(schema, currentType, t);
    const children = {};
    if ("object" === currentType) {
        const properties = sch.properties;
        if (properties && "object" == typeof properties) for (const [propName, propSchema] of Object.entries(properties))children[propName] = buildValidationTree(propSchema, t);
        if (sch.patternProperties && "object" == typeof sch.patternProperties) for (const [patternName, patternSchema] of Object.entries(sch.patternProperties))children[`pattern:${patternName}`] = buildValidationTree(patternSchema, t);
    }
    if ("array" === currentType) {
        const items = sch.items;
        if (Array.isArray(items)) items.forEach((it, idx)=>{
            children[`items[${idx}]`] = buildValidationTree(it, t);
        });
        else if (items) children.items = buildValidationTree(items, t);
        if (Array.isArray(sch.prefixItems)) sch.prefixItems.forEach((it, idx)=>{
            children[`prefixItems[${idx}]`] = buildValidationTree(it, t);
        });
    }
    const combinators = [
        "allOf",
        "anyOf",
        "oneOf"
    ];
    for (const comb of combinators){
        const arr = sch[comb];
        if (Array.isArray(arr)) arr.forEach((subSchema, idx)=>{
            children[[
                comb,
                idx
            ].join(":")] = buildValidationTree(subSchema, t);
        });
    }
    if (sch.not) children.not = buildValidationTree(sch.not, t);
    if (sch.$defs && "object" == typeof sch.$defs) for (const [defName, defSchema] of Object.entries(sch.$defs))children[`$defs:${defName}`] = buildValidationTree(defSchema, t);
    const definitions = sch.definitions;
    if (definitions && "object" == typeof definitions) for (const [defName, defSchema] of Object.entries(definitions))children[`definitions:${defName}`] = buildValidationTree(defSchema, t);
    const ownErrors = validation.success ? 0 : validation.errors?.length ?? 0;
    const childrenErrors = Object.values(children).reduce((sum, child)=>sum + child.cumulativeChildrenErrors, 0);
    return {
        name: currentType,
        validation,
        children,
        cumulativeChildrenErrors: ownErrors + childrenErrors
    };
}
export { buildValidationTree, getTypeValidation, validateSchemaByType };

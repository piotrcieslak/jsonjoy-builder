var tsconfig_namespaceObject = JSON.parse('{"extends":"../tsconfig-base.json","compilerOptions":{"composite":true,"declarationDir":"../dist","outDir":"../dist","types":[]},"include":["**/*.ts","**/*.tsx","**/*.json"]}');
var compilerOptions = tsconfig_namespaceObject.compilerOptions;
var extends_0 = tsconfig_namespaceObject["extends"];
var include = tsconfig_namespaceObject.include;
export default tsconfig_namespaceObject;
export { compilerOptions, extends_0 as extends, include };

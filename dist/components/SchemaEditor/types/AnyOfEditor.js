import { jsx } from "react/jsx-runtime";
import CombinatorEditor from "./CombinatorEditor.js";
const AnyOfEditor = (props)=>/*#__PURE__*/ jsx(CombinatorEditor, {
        ...props,
        combinator: "anyOf"
    });
const types_AnyOfEditor = AnyOfEditor;
export default types_AnyOfEditor;

import { ICodeParsingResult } from "code-parsing";
import { Token, DiagnosticType, Interpretation } from "./view-file-parser/types";

export { parse } from "./view-file-parser/parser";
export type ParsingResult = ICodeParsingResult<Token, DiagnosticType, Interpretation>;
import * as ViewFile from "./view-file-parser/types";
import * as Template from "./template-parser/types";
import * as TagWithAttributes from "./tag-with-attributes-parser/types";
import * as Json from "./json-parser/types";
import * as Expression from "./expression-parser/types";
import * as Attributes from "./attribute-parser/types";

export {
	ViewFile,
	Template,
	TagWithAttributes,
	Json,
	Expression,
	Attributes,
}
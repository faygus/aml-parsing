import { DiagnosticType } from "./diagnostic-type";
import { Interpretation } from "./interpretation";
import { Token } from "./tokens";
import { ICodeParsingResult } from "code-parsing";

export type ExpressionParsingResult = ICodeParsingResult<
Token,
DiagnosticType,
Interpretation>;

import { ICodeParsingResult } from "../../../../interfaces";
import { DiagnosticType } from "./diagnostic-type";
import { Interpretation } from "./interpretation";
import { Tokens } from "../../../../models/expressions";

export type ExpressionParsingResult = ICodeParsingResult<
Tokens,
DiagnosticType,
Interpretation>;

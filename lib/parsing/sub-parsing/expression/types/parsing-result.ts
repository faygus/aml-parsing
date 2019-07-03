import { ICodeParsingResult } from "../../../../interfaces";
import { TokenWithContextTypes } from "./token-with-context";
import { DiagnosticType } from "./diagnostic-type";
import { Interpretation } from "./interpretation";

export type ExpressionParsingResult = ICodeParsingResult<
TokenWithContextTypes,
DiagnosticType,
Interpretation>;

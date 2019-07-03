import { Token } from "../models/tokens";
import { ICodeParsingResult } from "./i-code-parsing-result";

export type ICodeParser<
	TokenType extends Token,
	DiagnosticType,
	InterpretationType
> = (data: string) =>
		ICodeParsingResult<TokenType, DiagnosticType, InterpretationType>;

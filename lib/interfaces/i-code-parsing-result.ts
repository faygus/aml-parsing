import { IDiagnostic } from "./i-diagnostic";
import { IToken } from "./i-token";
import { Token } from "../models/tokens";

export interface ICodeParsingResult<
	TokenType extends Token,
	DiagnosticType,
	InterpretationType> {

	getTokenAt(offset: number): TokenType | undefined;
	tokens: TokenType[];
	diagnostics: IDiagnostic<DiagnosticType>[];
	interpretation: InterpretationType;
	text: string;
}

export type AnyParsingResult = ICodeParsingResult<any, any, any>;

import { IDiagnostic } from "./i-diagnostic";
import { IToken } from "./i-token";

export interface ICodeParsingResult<TokenWithContextType extends { token: IToken<any>, context: any }, DiagnosticType> {

	getTokenAt(offset: number): TokenWithContextType | undefined;
	tokens: TokenWithContextType[];
	diagnostics: IDiagnostic<DiagnosticType>[];
}

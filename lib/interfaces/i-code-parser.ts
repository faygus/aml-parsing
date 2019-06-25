import { ICodeParsingResult } from "./i-code-parsing-result";
import { IToken } from "./i-token";

export type ICodeParser<TokenWithContextType extends {
	token: IToken<any>, context: any
},
	DiagnosticType> = (data: string) =>
		ICodeParsingResult<TokenWithContextType, DiagnosticType>;

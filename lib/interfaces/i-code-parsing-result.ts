import { IToken } from "./i-token";
import { IDiagnostic } from "./i-diagnostic";

export interface ICodeParsingResult<T, U> {
	getTokenAt(offset: number): IToken<T> | undefined;
	tokens: IToken<T>[];
	diagnostics: IDiagnostic<U>[];
}

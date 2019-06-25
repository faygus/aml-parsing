import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { IDiagnostic } from "../interfaces/i-diagnostic";
import { IToken } from "../interfaces/i-token";

export class BaseParsingResult<TokenWithContextType extends { token: IToken<any>, context: any }, DiagnosticType>
	implements ICodeParsingResult<TokenWithContextType, DiagnosticType> {
	constructor(
		private _tokens: TokenWithContextType[],
		private _diagnostics: IDiagnostic<DiagnosticType>[]) {

	}

	getTokenAt(offset: number): TokenWithContextType | undefined {
		for (const tokenWithContext of this._tokens) {
			if (offset < tokenWithContext.token.range.start) {
				return undefined;
			}
			if (offset <= tokenWithContext.token.range.end) {
				return tokenWithContext;
			}
		}
		return undefined;
	}

	get tokens(): TokenWithContextType[] {
		return this._tokens.slice();
	}

	get diagnostics(): IDiagnostic<DiagnosticType>[] {
		return this._diagnostics.slice();
	}
}

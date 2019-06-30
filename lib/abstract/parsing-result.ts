import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { IDiagnostic } from "../interfaces/i-diagnostic";
import { IToken } from "../interfaces/i-token";

export class ParsingResult<
	TokenWithContextType extends { token: IToken<any>, context: any },
	DiagnosticType,
	InterpretationType>
	implements ICodeParsingResult<TokenWithContextType, DiagnosticType, InterpretationType> {

	constructor(
		private _tokens: TokenWithContextType[],
		private _diagnostics: IDiagnostic<DiagnosticType>[],
		private _interpretation: InterpretationType) {

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

	get interpretation(): InterpretationType {
		return this._interpretation;
	}
}

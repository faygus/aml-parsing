import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { IDiagnostic } from "../interfaces/i-diagnostic";
import { IToken } from "../interfaces/i-token";
import { BaseParsingResult } from "./parsing-result";

export class BaseParsingResultBuilder<TokenWithContextType extends { token: IToken<any>, context: any }, DiagnosticType> {
	protected _tokens: TokenWithContextType[] = [];
	protected _diagnostics: IDiagnostic<DiagnosticType>[] = [];

	addToken(token: TokenWithContextType): void {
		this._tokens.push(token);
	}

	addDiagnostic(diagnostic: IDiagnostic<DiagnosticType>): void {
		this._diagnostics.push(diagnostic);
	}

	getResult(): ICodeParsingResult<TokenWithContextType, DiagnosticType> {
		return new BaseParsingResult(this._tokens, this._diagnostics);
	}

	merge(data: ICodeParsingResult<TokenWithContextType, DiagnosticType>, offset: number): void {
		this._tokens.push(...data.tokens.map(t => {
			(<any>t.token)._offset += offset; // TODO
			return t;
		}));
		this._diagnostics.push(...data.diagnostics.map(d => {
			d.offset += offset;
			return d;
		}));
	}
}

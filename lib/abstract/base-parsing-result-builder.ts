import { IToken } from "../interfaces/i-token";
import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { BaseParsingResult } from "./parsing-result";
import { IDiagnostic } from "../interfaces/i-diagnostic";
import { BaseToken } from "./base-token";

export class BaseParsingResultBuilder<T, U> {
	protected _tokens: IToken<T>[] = [];
	protected _diagnostics: IDiagnostic<U>[] = [];

	addToken(token: IToken<T>): void {
		this._tokens.push(token);
	}

	addDiagnostic(diagnostic: IDiagnostic<U>): void {
		this._diagnostics.push(diagnostic);
	}

	getResult(): ICodeParsingResult<T, U> {
		return new BaseParsingResult(this._tokens, this._diagnostics);
	}

	merge(data: ICodeParsingResult<T, U>, offset: number): void {
		this._tokens.push(...data.tokens.map(t => {
			(<any>t)._offset += offset; // TODO
			return t;
		}));
		this._diagnostics.push(...data.diagnostics.map(d => {
			d.offset += offset;
			return d;
		}));
	}
}

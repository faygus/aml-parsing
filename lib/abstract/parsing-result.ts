import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { IToken } from "../interfaces/i-token";
import { IDiagnostic } from "../interfaces/i-diagnostic";

export class BaseParsingResult<T, U> implements ICodeParsingResult<T, U> {
	constructor(private _tokens: IToken<T>[], private _diagnostics: IDiagnostic<U>[]) {

	}

	getTokenAt(offset: number): IToken<T> | undefined {
		for (const token of this._tokens) {
			if (offset < token.range.start) {
				return undefined;
			}
			if (offset <= token.range.end) {
				return token;
			}
		}
		return undefined;
	}

	get tokens(): IToken<T>[] {
		return this._tokens.slice();
	}

	get diagnostics(): IDiagnostic<U>[] {
		return this._diagnostics.slice();
	}
}

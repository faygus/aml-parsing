import { IToken } from "../interfaces/i-token";
import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { BaseParsingResult } from "./parsing-result";

export class BaseParsingResultBuilder<T> {
	protected _tokens: IToken<T>[] = [];

	addToken(token: IToken<T>): void {
		this._tokens.push(token);
	}

	getResult(): ICodeParsingResult<T> {
		return new BaseParsingResult(this._tokens);
	}
}

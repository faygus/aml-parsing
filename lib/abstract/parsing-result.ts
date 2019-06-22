import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { IToken } from "../interfaces/i-token";

export class BaseParsingResult<T> implements ICodeParsingResult<T> {
	constructor(private _tokens: IToken<T>[]) {

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
}

import { AmlToken } from "./types/aml-token";
import { AmlParsingResult } from "./types/aml-parsing-result";

export class AmlParsingResultBuilder {
	private _tokens: AmlToken[] = [];

	addToken(token: AmlToken): void {
		this._tokens.push(token);
	}

	getResult(): AmlParsingResult {
		return new AmlParsingResult(this._tokens);
	}
}

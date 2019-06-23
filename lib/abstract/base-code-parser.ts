import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { StringParser } from "../utils/string-parser";
import { BaseParsingResultBuilder } from "./base-parsing-result-builder";

export abstract class BaseCodeParser<T, U> {
	protected _stringParser: StringParser;
	protected _resultBuilder = new BaseParsingResultBuilder<T, U>();

	constructor(protected _data: string) {
		this._stringParser = new StringParser(_data);
	}

	parse(): ICodeParsingResult<T, U> {
		this.buildResult();
		return this._resultBuilder.getResult();
	}

	protected abstract buildResult(): void;
}

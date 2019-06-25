import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { StringParser } from "../utils/string-parser";
import { BaseParsingResultBuilder } from "./base-parsing-result-builder";
import { IToken } from "../interfaces/i-token";

export abstract class BaseCodeParser<TokenWithContextType extends { token: IToken<any>, context: any }, DiagnosticType> {
	protected _stringParser: StringParser;
	protected _resultBuilder = new BaseParsingResultBuilder<TokenWithContextType, DiagnosticType>();

	constructor(protected _data: string) {
		this._stringParser = new StringParser(_data);
	}

	parse(): ICodeParsingResult<TokenWithContextType, DiagnosticType> {
		this.buildResult();
		return this._resultBuilder.getResult();
	}

	get offset(): number {
		return this._stringParser.offset;
	}

	protected abstract buildResult(): void;
}

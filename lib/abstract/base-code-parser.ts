import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { StringParser } from "../utils/string-parser";
import { ParsingResultBuilder } from "./base-parsing-result-builder";
import { IToken } from "../interfaces/i-token";

export abstract class BaseCodeParser<
	TokenWithContextType extends { token: IToken<any>, context: any },
	DiagnosticType,
	InterpretationType> {
	protected _stringParser: StringParser;
	protected _resultBuilder = new ParsingResultBuilder<TokenWithContextType, DiagnosticType, InterpretationType>();

	constructor(protected _data: string) {
		this._stringParser = new StringParser(_data);
	}

	parse(): ICodeParsingResult<TokenWithContextType, DiagnosticType, InterpretationType> {
		this.buildResult();
		return this._resultBuilder.getResult();
	}

	get offset(): number {
		return this._stringParser.offset;
	}

	protected abstract buildResult(): void;
}

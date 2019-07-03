import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { StringParser } from "../utils/string-parser";
import { ParsingResultBuilder } from "./base-parsing-result-builder";
import { IToken } from "../interfaces/i-token";
import { StringNavigationInfos } from "../utils/string-navigation-infos";
import { Token } from "../models/tokens";

export abstract class BaseCodeParser<
	TokenType extends Token,
	DiagnosticType,
	InterpretationType> {
	protected _stringParser: StringParser;
	protected _resultBuilder = new ParsingResultBuilder<TokenType, DiagnosticType, InterpretationType>();

	constructor(protected _data: string, protected _endingCharacter?: string) {
		this._stringParser = new StringParser(_data);
	}

	parse(): ICodeParsingResult<TokenType, DiagnosticType, InterpretationType> {
		this.buildResult();
		this._resultBuilder.text = this._stringParser.previousString;
		return this._resultBuilder.getResult();
	}

	get offset(): number {
		return this._stringParser.offset;
	}

	protected abstract buildResult(): void;

	protected nextOperation(operation: () => void): void {
		if (!this._stringParser.currentChar) return;
		if (this._stringParser.currentChar === this._endingCharacter) return;
		operation.apply(this);
	}

	protected navigateBeforeEndingCharacter(data: string[]): StringNavigationInfos {
		const res = this._stringParser.navigateUntil([...data, this._endingCharacter]);
		if (res.stopPattern === this._endingCharacter) {
			this._stringParser.previous();
		}
		return res;
	}
}

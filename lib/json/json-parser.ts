import { BaseCodeParser } from "../abstract/base-code-parser";
import { ICodeParser as ICodeParserFunction } from "../interfaces/i-code-parser";
import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { nonEscapedValidator } from "../utils/escape";
import { StringParser } from "../utils/string-parser";
import { whiteSpaceCharacters } from "../utils/string-utils";
import { tokens } from "./tokens";
import { JsonDiagnostic } from "./types/diagnostic";
import { JsonDiagnosticType } from "./types/diagnostic-type";
import { JsonToken } from "./types/token";
import { JsonTokenType } from "./types/token-type";

export const parseJsonCode: ICodeParserFunction<JsonTokenType, JsonDiagnosticType> =
	(data: string): ICodeParsingResult<JsonTokenType, JsonDiagnosticType> => {
		const parser = new JsonCodeParser(data);
		return parser.parse();
	};

export class JsonCodeParser extends BaseCodeParser<JsonTokenType, JsonDiagnosticType> {

	constructor(data: string) {
		super(data);
	}

	protected buildResult(): void {
		const beforeOpenBracket = this._stringParser.navigateUntil(tokens.openBracket);
		const beforeOpenBracketParser = new StringParser(beforeOpenBracket.text);
		if (beforeOpenBracketParser.hasText) {
			const textStart = beforeOpenBracketParser.navigateToFirstNonEmptyChar().offset;
			const text = beforeOpenBracket.text.trim();
			// TODO add a token error ?
		}
		if (!this._stringParser.currentChar) {
			return;
		}
		this._stringParser.navigateToFirstNonEmptyChar();
		this.analyseKey();
	}

	private analyseKey(): void {
		if (this._stringParser.currentChar === tokens.quote) {
			this._stringParser.next();
			this.analyseQuotedKey();
		} else {
			this.analyseNonQuotedKey();
		}
	}

	private analyseQuotedKey(): void {
		const keyInfos = this._stringParser.navigateUntil(
			nonEscapedValidator(tokens.quote, tokens.escape)
		);
		const token = new JsonToken(keyInfos.range.start, JsonTokenType.KEY, keyInfos.text);
		this._resultBuilder.addToken(token);
		if (this._stringParser.navigateToFirstNonEmptyChar().currentChar !== tokens.colon) {
			// expected colon
			this.emitDiagnosticExpectedColon();
			this.analyseKey();
		} else {
			this._stringParser.next().navigateToFirstNonEmptyChar();
			this.analyseValue();
		}
	}

	private analyseNonQuotedKey(): void {
		const parsingInfos = this._stringParser.navigateUntil([
			tokens.colon,
			tokens.closeBracket,
			...whiteSpaceCharacters
		]);
		const token = new JsonToken(parsingInfos.range.start, JsonTokenType.KEY, parsingInfos.text);
		this._resultBuilder.addToken(token);
		if (parsingInfos.stopPattern === tokens.closeBracket) {
			return; // end of parsing
		}
		if (parsingInfos.stopPattern === tokens.colon) {
			this._stringParser.navigateToFirstNonEmptyChar();
			return this.analyseValue();
		}
		if (!this._stringParser.currentChar) return;
		this._stringParser.navigateToFirstNonEmptyChar();
		if (this._stringParser.currentChar !== tokens.colon) {
			this.emitDiagnosticExpectedColon();
			return this.analyseKey();
		}
		this._stringParser.next().navigateToFirstNonEmptyChar();
		this.analyseValue();
	}

	private analyseValue(): void {
		switch (this._stringParser.currentChar) {
			case tokens.quote:
				this._stringParser.next();
				this.analyseStringValue();
				break;
			case tokens.openBracket:
				this.analyseJsonObject();
				break;
		}
	}

	private analyseStringValue(): void {
		const parsingInfos = this._stringParser.navigateUntil(nonEscapedValidator(tokens.quote, tokens.escape));
		const token = new JsonToken(parsingInfos.range.start, JsonTokenType.STRING_VALUE, parsingInfos.text);
		this._resultBuilder.addToken(token);
		if (!this._stringParser.currentChar) return;
		this._stringParser.navigateToFirstNonEmptyChar();
		this.analyseAfterValue();
	}

	private analyseJsonObject(): void {
		// first char is {
		const parser = new JsonCodeParser(this._stringParser.nextString);
		const parsingResult = parser.parse();
		this._resultBuilder.merge(parsingResult, this._stringParser.offset);
		this._stringParser.next(parser._stringParser.offset).navigateToFirstNonEmptyChar();
		this.analyseAfterValue();
	}

	private analyseAfterValue(): void {
		switch (this._stringParser.currentChar) {
			case tokens.closeBracket:
				this._stringParser.next();
				return; // end of the parsing
			case tokens.comma:
				this._stringParser.next().navigateToFirstNonEmptyChar();
				break;
			default:
				this.emitDiagnosticExpectedComma();
				// for the next, we act like if there was a comma
				break;
		}
		this.analyseKey();
	}

	private emitDiagnosticExpectedColon(): void {
		const diagnostic = new JsonDiagnostic(this._stringParser.offset, JsonDiagnosticType.MISSING_COLON);
		this._resultBuilder.addDiagnostic(diagnostic);
	}

	private emitDiagnosticExpectedComma(): void {
		const diagnostic = new JsonDiagnostic(this._stringParser.offset, JsonDiagnosticType.EXPECTED_COMMA);
		this._resultBuilder.addDiagnostic(diagnostic);
	}
}

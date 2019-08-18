import {
	BaseCodeParser, ICodeParsingResult, StringParser,
	nonEscapedValidator, whiteSpaceCharacters
} from "code-parsing";
import { Token } from "./types/tokens";
import { IKeyValue } from "./types/intepretation";
import { Builder } from "./builder";
import { tokens } from "./tokens";
import { JsonDiagnostic } from "./types/diagnostic";
import { JsonDiagnosticType } from "./types/diagnostic-type";

export class Parser extends BaseCodeParser<
	Token,
	JsonDiagnosticType,
	IKeyValue,
	Builder> {

	protected getBuilder(): Builder {
		return new Builder();
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
		} else { // TODO simple quote, back quote
			this.analyseNonQuotedKey();
		}
	}

	private analyseQuotedKey(): void {
		const keyInfos = this._stringParser.navigateUntil(
			nonEscapedValidator(tokens.quote, tokens.escape)
		);
		this.registerKey(keyInfos.range.start, keyInfos.text);
		// this._resultBuilder.addToken(token); // TODO context
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
		this.registerKey(parsingInfos.range.start, parsingInfos.text);
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
		this.registerLiteralValue(parsingInfos.range.start, parsingInfos.text);
		if (!this._stringParser.currentChar) return;
		this._stringParser.navigateToFirstNonEmptyChar();
		this.analyseAfterValue();
	}

	private analyseJsonObject(): void {
		// first char is {
		const offset = this._stringParser.offset;
		const parser = new Parser(this._stringParser.nextString);
		const parsingResult = parser.parse();
		this.registerJsonObject(offset, parsingResult.text, parsingResult);
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
		this._parsingResultBuilder.addDiagnostic(diagnostic);
	}

	private emitDiagnosticExpectedComma(): void {
		const diagnostic = new JsonDiagnostic(this._stringParser.offset, JsonDiagnosticType.EXPECTED_COMMA);
		this._parsingResultBuilder.addDiagnostic(diagnostic);
	}

	private registerKey(offset: number, key: string): void {
		this._parsingResultBuilder.addKey(offset, key);
	}

	private registerLiteralValue(offset: number, value: string): void {
		this._parsingResultBuilder.addRegisterLiteralValue(offset, value);
	}

	private registerJsonObject(offset: number, text: string, parsingResult: ICodeParsingResult<Token, JsonDiagnosticType, IKeyValue>): void {
		this._parsingResultBuilder.addObjectValue(offset, text, parsingResult);
	}
}

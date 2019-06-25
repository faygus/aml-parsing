import { BaseCodeParser } from "../abstract/base-code-parser";
import { ICodeParser as ICodeParserFunction } from "../interfaces/i-code-parser";
import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { nonEscapedValidator } from "../utils/escape";
import { StringParser } from "../utils/string-parser";
import { whiteSpaceCharacters } from "../utils/string-utils";
import { tokens } from "./tokens";
import { JsonDiagnostic } from "./types/diagnostic";
import { JsonDiagnosticType } from "./types/diagnostic-type";
import { JsonToken, JsonTokenWithContext } from "./types/token";
import { JsonTokenType } from "./types/token-type";
import { JsonTokenWithContextTypes } from "./types/token-with-context";
import { JsonKeyCxt } from "./types/context/key";
import { JsonPropertyValueCxt } from "./types/context/value";
import { JsonTreeParser } from "./tree-parser";
import { JsonElement, JsonProperty } from "./types/context/utils/element";

export const parseJsonCode: ICodeParserFunction<JsonTokenWithContextTypes, JsonDiagnosticType> =
	(data: string): ICodeParsingResult<JsonTokenWithContextTypes, JsonDiagnosticType> => {
		const parser = new JsonCodeParser(data);
		return parser.parse();
	};

export class JsonCodeParser extends BaseCodeParser<JsonTokenWithContextTypes, JsonDiagnosticType> {

	private _treeParser = new JsonTreeParser();

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
		const parser = new JsonCodeParser(this._stringParser.nextString);
		const parsingResult = parser.parse();
		for (const token of parsingResult.tokens) {
			const tree = this._treeParser.currentElement;
			tree.properties.slice().reverse()[0].value = token.context.parents;
			token.context.parents = tree;
		}
		this._resultBuilder.merge(parsingResult, this._stringParser.offset);
		// TODO merge the treeParser of the parent parser
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

	private registerKey(offset: number, key: string): void {
		const token = new JsonToken(offset, JsonTokenType.KEY, key);
		const context = new JsonKeyCxt();
		context.parents = this._treeParser.currentElement;
		const tokenWithContext = new JsonTokenWithContext(token, context);
		this._resultBuilder.addToken(tokenWithContext);
		this._treeParser.addKey(key);
	}

	private registerLiteralValue(offset: number, value: string): void {
		const token = new JsonToken(offset, JsonTokenType.STRING_VALUE, value);
		const context = new JsonPropertyValueCxt();
		context.key = this._treeParser.curentKeyEdited;
		context.parents = this._treeParser.currentElement;
		const tokenWithContext = new JsonTokenWithContext(token, context);
		this._resultBuilder.addToken(tokenWithContext);
		this._treeParser.setLiteralValue(value);
	}
}

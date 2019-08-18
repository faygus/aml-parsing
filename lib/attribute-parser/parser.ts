import {
	BaseCodeParser, whiteSpaceCharacters,
	nonEscapedValidator, StringUtils
} from "code-parsing";
import { Interpretation } from "./types/interpretation";
import { Builder } from "./builder";
import { DiagnosticType } from "./types/diagnostic-type";
import { Token } from "./types/tokens";
import { symbols } from "./symbols";
import { Parser as JsonParser } from "../json-parser/parser";
import { Parser as ExpressionParser } from "../expression-parser/parser";

export class Parser extends BaseCodeParser<Token, DiagnosticType, Interpretation, Builder> {

	protected getBuilder(): Builder {
		return new Builder();
	}

	protected buildResult(): void {
		this._stringParser.navigateToFirstNonEmptyChar();
		const infos = this._stringParser.navigateUntil([...whiteSpaceCharacters, symbols.equal, this._endingCharacter]);
		this._parsingResultBuilder.registerAttributeName(infos.range.start, infos.text);
		if (StringUtils.charIsEmpty(infos.stopPattern)) {
			if (this._stringParser.navigateToFirstNonEmptyChar().currentChar !== symbols.equal) {
				return;
			}
			this._stringParser.next(); // skip the equal char
		}
		this._stringParser.navigateToFirstNonEmptyChar();
		this.nextOperation(this.parseAttributeValue);
	}

	private parseAttributeValue(): void {
		const firstChar = this._stringParser.currentChar;
		switch (firstChar) {
			case symbols.openExpressionBracket:
				this._stringParser.next();
				this.nextOperation(this.parseAttributeExpressionValue);
				break;
			case symbols.quote:
				this._stringParser.next();
				const attributeValueInfos = this._stringParser.navigateUntil(
					nonEscapedValidator(symbols.quote, symbols.escape)
				);
				const attributeValue = attributeValueInfos.text;
				this._parsingResultBuilder.registerAttributeValue(attributeValueInfos.range.start, attributeValue);
				break;
			case symbols.openObjectBracket:
				this.parseJsonObject();
				break;
		}
	}

	private parseJsonObject(): void {
		const jsonParser = new JsonParser(this._stringParser.nextString);
		const jsonParsingResult = jsonParser.parse();
		this._parsingResultBuilder.registerJsonValue(this._stringParser.offset, jsonParsingResult);
		this._stringParser.next(jsonParser.offset);
	}

	private parseAttributeExpressionValue(): void {
		const parser = new ExpressionParser(this._stringParser.nextString, symbols.closeExpressionBracket);
		const res = parser.parse();
		this._parsingResultBuilder.registerExpressionValue(this._stringParser.offset, res);
		this._stringParser.next(parser.offset + 1); // ignore ')'
	}
}

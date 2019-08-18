import { BaseCodeParser, whiteSpaceCharacters, StringUtils } from "code-parsing";
import { Interpretation } from "./types/interpretation";
import { Builder } from "./builder";
import { DiagnosticType } from "./types/diagnostic-type";
import { Token } from "./types/tokens";
import { Parser as AttributeParser } from "../attribute-parser/parser";

export class Parser extends BaseCodeParser<Token, DiagnosticType, Interpretation, Builder> {

	protected getBuilder(): Builder {
		return new Builder();
	}

	protected buildResult(): void {
		this._stringParser.navigateToFirstNonEmptyChar();
		const infos = this._stringParser.navigateUntil([...whiteSpaceCharacters, this._endingCharacter]);
		this._parsingResultBuilder.addTag(infos.range.start, infos.text);
		if (StringUtils.charIsEmpty(infos.stopPattern)) {
			this._stringParser.navigateToFirstNonEmptyChar();
			this.nextOperation(this.parseAttributes);
		}
	}

	private parseAttributes(): void {
		const offset = this._stringParser.offset;
		const attributeParser = new AttributeParser(this._stringParser.nextString);
		const parsingRes = attributeParser.parse();
		this._parsingResultBuilder.addAttribute(offset, parsingRes);
		this._stringParser.next(attributeParser.offset);
		this._stringParser.navigateToFirstNonEmptyChar();
		this.nextOperation(this.parseAttributes);
	}
}

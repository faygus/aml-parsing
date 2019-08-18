import { BaseCodeParser } from "code-parsing";
import { Parser as TagWithAttributesParser } from "../tag-with-attributes-parser/parser";
import { Builder } from "./builder";
import { Interpretation } from "./types/interpretation";
import { symbols } from "./symbols";
import { DiagnosticType } from "./types/diagnostic-type";
import { Token } from "./types/tokens";

export class Parser extends BaseCodeParser<Token, DiagnosticType, Interpretation, Builder> {

	protected getBuilder(): Builder {
		return new Builder();
	}

	protected buildResult(): void {
		const offset = this._stringParser.navigateToFirstNonEmptyChar().offset;
		const parser = new TagWithAttributesParser(this._stringParser.nextString, symbols.contentBracket.start);
		const parsingRes = parser.parse();
		this._parsingResultBuilder.addRootView(offset, parsingRes);
		this._stringParser.next(parser.offset);
		if (this._stringParser.nextString.startsWith(symbols.contentBracket.start)) {
			this._stringParser.next(symbols.contentBracket.start.length);
			this._stringParser.navigateToFirstNonEmptyChar();
			this.parseEmbededViews();
		}
	}

	private parseEmbededViews(): void {
		// TODO
	}
}

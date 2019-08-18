import { BaseCodeParser, ICodeParsingResult } from "code-parsing";
import { Interpretation } from "./types/interpretation";
import { Builder } from "./builder";
import { Token } from "./types/tokens";
import { DiagnosticType } from "./types/diagnostic-type";
import { Parser as DataInterfaceParser } from "data-interface-parser";
import { Parser as TemplateParser } from "../template-parser/parser";

export function parse(data: string): ICodeParsingResult<Token, DiagnosticType, Interpretation> {
	const parser = new Parser(data);
	return parser.parse();
}

export class Parser extends BaseCodeParser<Token, DiagnosticType, Interpretation, Builder> {

	protected getBuilder(): Builder {
		return new Builder();
	}

	protected buildResult(): void {
		const offset = this._stringParser.navigateToFirstNonEmptyChar().offset;
		const dataInterfaceParser = new DataInterfaceParser(this._data, '\n\n');
		const parsingRes = dataInterfaceParser.parse();
		this._parsingResultBuilder.addDataInterface(offset, parsingRes);
		this._stringParser.next(dataInterfaceParser.offset);
		this._stringParser.navigateToFirstNonEmptyChar();
		this.parseTemplate();
	}

	private parseTemplate(): void {
		const offset = this._stringParser.offset;
		const parser = new TemplateParser(this._stringParser.nextString);
		const parsingRes = parser.parse();
		this._parsingResultBuilder.addTemplate(offset, parsingRes);
		this._stringParser.next(parser.offset);
	}
}

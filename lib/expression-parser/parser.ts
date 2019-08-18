import { BaseCodeParser, whiteSpaceCharacters, nonEscapedValidator } from "code-parsing";
import { tokens } from "./tokens";
import { DiagnosticType } from "./types/diagnostic-type";
import { Interpretation } from "./types/interpretation";
import { Token } from "./types/tokens";
import { Builder } from "./builder";

/**
 * the expression can be a literal : "hello world",
 * a model variable : $myText,
 * a variable with a pipe : $myText | myPipe
 */
export class Parser extends BaseCodeParser<
	Token,
	DiagnosticType,
	Interpretation,
	Builder> {

	protected getBuilder(): Builder {
		return new Builder();
	}

	buildResult(): void {
		const firstChar = this._stringParser.currentChar;
		switch (firstChar) {
			case tokens.viewModelVariablePrefix:
				this._stringParser.next();
				return this.parseVariableName();
			case tokens.quote:
				this._stringParser.next();
				return this.parseStringArgument();
			// TODO case 0-9,a-z (literal value)
		}
		console.warn('should be prefix by $ or "');
	}

	private parseVariableName(): void {
		const infos = this.navigateBeforeEndingCharacter(whiteSpaceCharacters);
		const variableName = infos.text;
		this._parsingResultBuilder.addVariableName(infos.range.start, variableName);
		this.nextOperation(this.parseAfterArgument);
	}

	private parseStringArgument(): void {
		const infos = this._stringParser.navigateUntil(
			nonEscapedValidator(tokens.quote, tokens.escape));
		const stringArgument = infos.text;
		this._parsingResultBuilder.addStringArgument(infos.range.start, stringArgument);
		this.nextOperation(this.parseAfterArgument);
	}

	private parseAfterArgument(): void {
		const firstChar = this._stringParser.navigateToFirstNonEmptyChar().currentChar;
		if (firstChar === tokens.pipe) {
			this._stringParser.next().navigateToFirstNonEmptyChar();
			this.nextOperation(this.parsePipeName);
		} else {
			this._stringParser.navigateUntil(this._endingCharacter);
		}
	}

	private parsePipeName(): void {
		const infos = this.navigateBeforeEndingCharacter(whiteSpaceCharacters);
		const pipeName = infos.text;
		this._parsingResultBuilder.addPipeName(infos.range.start, pipeName);
	}
}

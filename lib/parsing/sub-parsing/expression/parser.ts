import { BaseCodeParser } from "../../../abstract/base-code-parser";
import { nonEscapedValidator } from "../../../utils/escape";
import { whiteSpaceCharacters } from "../../../utils/string-utils";
import { Register } from "./register";
import { tokens } from "./tokens";
import { DiagnosticType } from "./types/diagnostic-type";
import { Interpretation } from "./types/interpretation";
import * as Model from "../../../models/expressions";

/**
 * the expression can be a literal : "hello world",
 * a model variable : $myText,
 * a variable with a pipe : $myText | myPipe
 */
export class ExpressionParser extends BaseCodeParser<
	Model.Tokens,
	DiagnosticType,
	Interpretation> {

	private _register: Register;

	constructor(data: string, endingCharacter?: string) {
		super(data, endingCharacter);
		this._register = new Register(this._resultBuilder);
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
		this._register.addVariableName(infos.range.start, variableName);
		this.nextOperation(this.parseAfterArgument);
	}

	private parseStringArgument(): void {
		const infos = this._stringParser.navigateUntil(
			nonEscapedValidator(tokens.quote, tokens.escape));
		const stringArgument = infos.text;
		this._register.addStringArgument(infos.range.start, stringArgument);
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
		this._register.addPipeName(infos.range.start, pipeName);
	}
}

import { BaseCodeParser } from "../abstract/base-code-parser";
import { ICodeParser as ICodeParserFunction } from "../interfaces/i-code-parser";
import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { nonEscapedValidator } from "../utils/escape";
import { StringParser } from "../utils/string-parser";
import { StringUtils, whiteSpaceCharacters } from "../utils/string-utils";
import { AmlInterpretation } from "./interpreter/interpretation";
import { Register } from "./register";
import { ExpressionParser } from "./sub-parsing/expression/parser";
import { JsonCodeParser } from "./sub-parsing/json/json-parser";
import { tokens } from "./tokens";
import { AmlDiagnosticType } from "./types/diagnostic-type";
import * as Model from "../models/aml";

export const parseAmlCode: ICodeParserFunction<
	Model.Tokens,
	AmlDiagnosticType,
	AmlInterpretation> =
	(data: string): ICodeParsingResult<Model.Tokens, AmlDiagnosticType, AmlInterpretation> => {
		const parser = new AmlParser(data);
		return parser.parse();
	};

export class AmlParser extends BaseCodeParser<Model.Tokens, AmlDiagnosticType, AmlInterpretation> {
	private _register: Register;

	constructor(data: string) {
		super(data);
		this._register = new Register(this._resultBuilder);
	}

	protected buildResult(): void {
		while (this._stringParser.currentChar) {
			this.parseNewTag();
		}
	}

	private parseNewTag(): void {
		const beforeTag = this._stringParser.navigateUntil(tokens.openTagBracket);
		const beforeTagParser = new StringParser(beforeTag.text);
		if (beforeTagParser.hasText) {
			const textStart = beforeTagParser.navigateToFirstNonEmptyChar().offset;
			const text = beforeTag.text.trim();
			// TODO add a token error ?
		}
		if (!beforeTag.stopPattern) {
			return;
		}
		const closeTagToken = `/`;
		if (this._stringParser.nextString.startsWith(closeTagToken)) {
			this._stringParser.next(closeTagToken.length);
			this.parseCloseTag();
			return;
		}
		const tagInfos = this._stringParser.navigateUntil([tokens.closeTagBracket, tokens.selfCloseToken, ...whiteSpaceCharacters]);
		const tag = tagInfos.text;
		this._register.registerTag(tagInfos.range.start, tag);
		if (tagInfos.stopPattern === tokens.selfCloseToken) {
			// TODO this._context.removeLast();
			return;
		} else if (tagInfos.stopPattern === tokens.closeTagBracket) {
			return;
		}
		if (!this._stringParser.currentChar) return;
		if (this.checkCloseDeclarationTag()) return;
		this.parseAttributeName();
	}

	/**
	 * returns true if the new opened tag is closed
	 */
	private checkCloseDeclarationTag(): boolean {
		this._stringParser.navigateToFirstNonEmptyChar();
		if (this._stringParser.nextString.startsWith(tokens.selfCloseToken)) {
			this._stringParser.next(tokens.selfCloseToken.length);
			this._register.closeDeclarationTag();
			return true;
		}
		if (this._stringParser.nextString.startsWith(tokens.closeTagBracket)) {
			this._stringParser.next(tokens.closeTagBracket.length);
			return true;
		}
		return false;
	}

	private parseCloseTag(): void {
		this._stringParser.navigateToFirstNonEmptyChar();
		const infos = this._stringParser.navigateUntil([tokens.closeTagBracket, ...whiteSpaceCharacters]);
		const offset = infos.range.start;
		if (infos.text) {
			this._register.closeTag(infos.text);
		} else {
			// TODO add token UNMATCHED_CLOSING_TAG // closing tag without name
		}
		if (!this._stringParser.currentChar) {
			return;
		}
		this._stringParser.navigateUntil(tokens.closeTagBracket);
	}

	private parseAttributeName(): void {
		// parse attribute name
		const attributeNameInfos = this._stringParser.navigateUntil([
			tokens.equal,
			tokens.closeTagBracket,
			...whiteSpaceCharacters
		]);
		const attributeName = attributeNameInfos.text;
		const attributeNameOffset = attributeNameInfos.range.start;
		if ([tokens.closeTagBracket, '', undefined].indexOf(attributeNameInfos.stopPattern) >= 0) {
			// TODO add token without value attributeName, attributeNameOffset - length
			this._register.registerAttributeName(attributeNameOffset, attributeName);
			return;
		}
		if (StringUtils.charIsEmpty(attributeNameInfos.stopPattern)) {
			if (this._stringParser.navigateToFirstNonEmptyChar().currentChar !== tokens.equal) {
				// TODO add token AttributeWithoutValue attributeName, attributeNameOffset
				this._register.registerAttributeName(attributeNameOffset, attributeName);
				if (this.checkCloseDeclarationTag()) return;
				return this.parseAttributeName();
			}
			this._stringParser.next(); // skip the equal char
		}
		this._register.registerAttributeName(attributeNameOffset, attributeName);
		this._stringParser.navigateToFirstNonEmptyChar();
		if (!this._stringParser.currentChar) return;
		this.parseAttributeValue();
	}

	private parseAttributeValue(): void {
		const firstChar = this._stringParser.currentChar;
		switch (firstChar) {
			case tokens.openExpressionBracket:
				this._stringParser.next();
				this.nextOperation(this.parseAttributeExpressionValue);
				break;
			case tokens.quote:
				this._stringParser.next();
				const attributeValueInfos = this._stringParser.navigateUntil(
					nonEscapedValidator(tokens.quote, tokens.escape)
				);
				const attributeValue = attributeValueInfos.text;
				this._register.registerAttributeValue(attributeValueInfos.range.start, attributeValue);
				break;
			case tokens.openObjectBracket:
				this.parseJsonObject();
				break;
		}
		if (!this._stringParser.currentChar) return;
		if (this.checkCloseDeclarationTag()) return;
		return this.parseAttributeName();
	}

	private parseJsonObject(): void {
		const jsonParser = new JsonCodeParser(this._stringParser.nextString);
		const jsonParsingResult = jsonParser.parse();
		this._register.registerAttributeJSONValue(this._stringParser.offset, jsonParsingResult);
		this._stringParser.next(jsonParser.offset);
	}

	private parseAttributeExpressionValue(): void {
		const parser = new ExpressionParser(this._stringParser.nextString, tokens.closeExpressionBracket);
		const res = parser.parse();
		this._register.registerAttributeExpressionValue(this._stringParser.offset, res);
		this._stringParser.next(parser.offset + 1); // ignore )
	}
}

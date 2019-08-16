import { BaseCodeParser } from "code-parsing";
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

export class AmlParser extends BaseCodeParser<Model.Tokens, AmlDiagnosticType, AmlInterpretation> {
	private _register: Register;

	constructor(data: string) {
		super(data);
		this._register = new Register(this._resultBuilder);
	}

	protected buildResult(): void {
		this.parseOpeningTag();
	}

	private parseOpeningTag(): void {
		this.parseBeforeTag();
		if (!this._stringParser.currentChar) {
			this._register.registerTag(this._stringParser.offset, '');
			return;
		}
		const closeTagToken = `/`;
		if (this._stringParser.nextString.startsWith(closeTagToken)) {
			// TODO error, the tag can not be closed now
			this._stringParser.navigateUntil(tokens.closeTagBracket);
			return this.nextOperation(this.parseOpeningTag);
		}
		const tagInfos = this._stringParser.navigateUntil([tokens.closeTagBracket, tokens.selfCloseToken, ...whiteSpaceCharacters]);
		const tag = tagInfos.text;
		this._register.registerTag(tagInfos.range.start, tag);
		if (tagInfos.stopPattern === tokens.selfCloseToken) {
			// TODO this._context.removeLast();
			return;
		}
		if (tagInfos.stopPattern === tokens.closeTagBracket) {
			this._stringParser.navigateToFirstNonEmptyChar();
			return this.nextOperation(this.parseInsideNode);
		}
		this.nextOperation(this.parseAfterTag);
	}

	/**
	 * returns true if the new opened tag is closed
	 */
	private parseAfterTag(): void {
		this._stringParser.navigateToFirstNonEmptyChar();
		if (this._stringParser.nextString.startsWith(tokens.selfCloseToken)) {
			this._stringParser.next(tokens.selfCloseToken.length);
			this._register.closeDeclarationTag();
			return;
		}
		if (this._stringParser.nextString.startsWith(tokens.closeTagBracket)) {
			this._stringParser.next(tokens.closeTagBracket.length);
			// TODO instanciate a new parser and use recursion
			this.nextOperation(this.parseInsideNode);
		}
		this._stringParser.navigateToFirstNonEmptyChar();
		this.nextOperation(this.parseAttributeName);
	}

	private parseCloseTag(): void {
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
			return this.nextOperation(this.parseInsideNode);
		}
		if (StringUtils.charIsEmpty(attributeNameInfos.stopPattern)) {
			if (this._stringParser.navigateToFirstNonEmptyChar().currentChar !== tokens.equal) {
				// TODO add token AttributeWithoutValue attributeName, attributeNameOffset
				this._register.registerAttributeName(attributeNameOffset, attributeName);
				return (this.nextOperation(this.parseAfterTag));
			}
			this._stringParser.next(); // skip the equal char
		}
		this._register.registerAttributeName(attributeNameOffset, attributeName);
		this._stringParser.navigateToFirstNonEmptyChar();
		this.nextOperation(this.parseAttributeValue);
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
		return this.nextOperation(this.parseAfterTag);
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
		this._stringParser.next(parser.offset + 1); // ignore ')'
	}

	private parseInsideNode(): void {
		this.parseBeforeTag();
		this._stringParser.previous();
		if (this._stringParser.nextString.startsWith(tokens.closeTag)) {
			this._stringParser.next(tokens.closeTag.length);
			this._stringParser.navigateToFirstNonEmptyChar();
			this.parseCloseTag();
		} else {
			const parser = new AmlParser(this._stringParser.nextString);
			const res = parser.parse();
			this._register.registerChildNode(this._stringParser.offset, res);
			this._stringParser.next(parser.offset);
			this.nextOperation(this.parseInsideNode);
		}
	}

	private parseBeforeTag(): void {
		const beforeTag = this._stringParser.navigateUntil(tokens.openTagBracket);
		const beforeTagParser = new StringParser(beforeTag.text);
		if (beforeTagParser.hasText) {
			const textStart = beforeTagParser.navigateToFirstNonEmptyChar().offset;
			const text = beforeTag.text.trim();
			// TODO add a token error ?
		}
	}
}

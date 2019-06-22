import { BaseCodeParser } from "../abstract/base-code-parser";
import { ICodeParser as ICodeParserFunction } from "../interfaces/i-code-parser";
import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { StringParser } from "../utils/string-parser";
import { StringUtils, whiteSpaceCharacters } from "../utils/string-utils";
import { ParsingPath } from "./parsing-path";
import { tokens } from "./tokens";
import { AmlToken } from "./types/aml-token";
import { AmlTokenType } from "./types/token-type";

export const parseAmlCode: ICodeParserFunction<AmlTokenType> = (data: string): ICodeParsingResult<AmlTokenType> => {
	const parser = new AmlCodeParser(data);
	return parser.parse();
};

export class AmlCodeParser extends BaseCodeParser<AmlTokenType> {
	private _nodesPath = new ParsingPath();

	constructor(data: string) {
		super(data);
	}

	protected buildResult(): void {
		while (this._stringParser.currentChar) {
			this.parseNewTag();
		}
	}

	private parseNewTag(): void {
		const beforeTag = this._stringParser.navigateUntil(tokens.tagOpenBracket);
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
		const tagInfos = this._stringParser.navigateUntil([tokens.tagCloseBracket, tokens.selfCloseToken, ...whiteSpaceCharacters]);
		const tag = tagInfos.text;
		this._resultBuilder.addToken(new AmlToken(tagInfos.range.start, AmlTokenType.TAG, tag));
		if (tagInfos.stopPattern === tokens.selfCloseToken) {
			// TODO this._context.removeLast();
			return;
		} else if (tagInfos.stopPattern === tokens.tagCloseBracket) {
			return;
		}
		if (this.checkCloseTag()) return;
		this.parseAttribute(tag);
	}

	/**
	 * returns true if the tag is closed
	 */
	private checkCloseTag(): boolean {
		this._stringParser.navigateToFirstNonEmptyChar();
		if (this._stringParser.nextString.startsWith(tokens.selfCloseToken)) {
			this._nodesPath.closeLastTag();
			this._stringParser.next(tokens.selfCloseToken.length);
			return true;
		}
		if (this._stringParser.nextString.startsWith(tokens.tagCloseBracket)) {
			this._stringParser.next(tokens.tagCloseBracket.length);
			return true;
		}
		return false;
	}

	private parseCloseTag(): void {
		this._stringParser.navigateToFirstNonEmptyChar();
		const infos = this._stringParser.navigateUntil([tokens.tagCloseBracket, ...whiteSpaceCharacters]);
		const offset = infos.range.start;
		if (infos.text) {
			if (!this._nodesPath.closeTag(infos.text)) {
				// TODO ad token UNMATCHED_CLOSING_TAG
			}
		} else {
			// TODO add token UNMATCHED_CLOSING_TAG // closing tag without name
		}
		if (infos.stopPattern === tokens.tagCloseBracket) {
			return;
		}
		this._stringParser.navigateUntil(tokens.tagCloseBracket);
	}

	private parseAttribute(tag: string): void {
		// parse attribute name
		const attributeNameInfos = this._stringParser.navigateUntil([tokens.equal, tokens.tagCloseBracket, ...whiteSpaceCharacters]);
		const attributeName = attributeNameInfos.text;
		const attributeNameOffset = attributeNameInfos.range.start;
		if (attributeNameInfos.stopPattern === tokens.tagCloseBracket) {
			// TODO add token without value attributeName, attributeNameOffset - length
			return;
		}
		if (StringUtils.charIsEmpty(attributeNameInfos.stopPattern)) {
			if (this._stringParser.navigateToFirstNonEmptyChar().currentChar !== tokens.equal) {
				// TODO add token AttributeWithoutValue attributeName, attributeNameOffset
				if (this.checkCloseTag()) return;
				return this.parseAttribute(tag);
			}
			this._stringParser.next(); // skip the equal char
		}
		this._resultBuilder.addToken(new AmlToken(attributeNameOffset, AmlTokenType.ATTRIBUTE_NAME, attributeName));
		// parse attribute value
		const firstAttributeValueChar = this._stringParser.navigateToFirstNonEmptyChar().currentChar;
		if (firstAttributeValueChar === tokens.quote) {
			this._stringParser.next();
			const attributeValueInfos = this._stringParser.navigateUntil({
				isValid(data) {
					if (data.length === 0) return null;
					const reversedString = data.split('').reverse().join('');
					if (reversedString[0] !== tokens.quote) return null;
					let escaped = false;
					for (let i = 1; i < reversedString.length; i++) {
						const char = reversedString[i];
						if (char !== tokens.escape) {
							return escaped ? null : {
								stopPattern: tokens.quote
							};
						}
						escaped = !escaped;
					}
					return null;
				}
			});
			const attributeValue = attributeValueInfos.text;
			this._resultBuilder.addToken(new AmlToken(attributeValueInfos.range.start,
				AmlTokenType.ATTRIBUTE_VALUE, attributeValue));
		} else {
			// TODO attribute inside {...}
		}
		if (this.checkCloseTag()) return;
		return this.parseAttribute(tag);
	}
}

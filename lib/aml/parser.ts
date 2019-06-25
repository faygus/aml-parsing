import { BaseCodeParser } from "../abstract/base-code-parser";
import { ICodeParser as ICodeParserFunction } from "../interfaces/i-code-parser";
import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { nonEscapedValidator } from "../utils/escape";
import { StringParser } from "../utils/string-parser";
import { StringUtils, whiteSpaceCharacters } from "../utils/string-utils";
import { TreeParser } from "./tree-parser";
import { tokens } from "./tokens";
import { AmlToken, AmlTokenWithContext } from "./types/aml-token";
import { AmlDiagnosticType } from "./types/diagnostic-type";
import { AmlTokenType } from "./types/token-type";
import { AmlAttributeNameCxt } from "./types/context/attribute-name";
import { AmlAttributeValueCxt } from "./types/context/attribute-value";
import { AmlTagNameCxt } from "./types/context/tag-name";
import { AmlTokenWithContextTypes } from "./types/aml-token-with-context";
import { JsonCodeParser } from "../json/json-parser";
import { JsonTokenType } from "../json/types/token-type";
import { AmlJsonKeyCxt } from "./types/context/json-key";
import { AmlJsonLiteralValueCxt } from "./types/context/json-literal-value";

export const parseAmlCode: ICodeParserFunction<AmlTokenWithContextTypes, AmlDiagnosticType> =
	(data: string): ICodeParsingResult<AmlTokenWithContextTypes, AmlDiagnosticType> => {
		const parser = new AmlCodeParser(data);
		return parser.parse();
	};

export class AmlCodeParser extends BaseCodeParser<AmlTokenWithContextTypes, AmlDiagnosticType> {
	private _treeParser = new TreeParser();

	constructor(data: string) {
		super(data);
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
		this.registerTag(tagInfos.range.start, tag);
		if (tagInfos.stopPattern === tokens.selfCloseToken) {
			// TODO this._context.removeLast();
			return;
		} else if (tagInfos.stopPattern === tokens.closeTagBracket) {
			return;
		}
		if (!this._stringParser.currentChar) return;
		if (this.checkCloseTag()) return;
		this.parseAttributeName();
	}

	/**
	 * returns true if the tag is closed
	 */
	private checkCloseTag(): boolean {
		this._stringParser.navigateToFirstNonEmptyChar();
		if (this._stringParser.nextString.startsWith(tokens.selfCloseToken)) {
			this._treeParser.closeLastTag();
			this._stringParser.next(tokens.selfCloseToken.length);
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
			if (!this._treeParser.closeTag(infos.text)) {
				// TODO ad token UNMATCHED_CLOSING_TAG
			}
		} else {
			// TODO add token UNMATCHED_CLOSING_TAG // closing tag without name
		}
		if (infos.stopPattern === tokens.closeTagBracket) {
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
			return;
		}
		if (StringUtils.charIsEmpty(attributeNameInfos.stopPattern)) {
			if (this._stringParser.navigateToFirstNonEmptyChar().currentChar !== tokens.equal) {
				// TODO add token AttributeWithoutValue attributeName, attributeNameOffset
				if (this.checkCloseTag()) return;
				return this.parseAttributeName();
			}
			this._stringParser.next(); // skip the equal char
		}
		this.registerAttributeName(attributeNameOffset, attributeName);
		this._stringParser.navigateToFirstNonEmptyChar();
		if (!this._stringParser.currentChar) return;
		this.parseAttributeValue();
	}

	private parseAttributeValue(): void {
		const firstAttributeValueChar = this._stringParser.currentChar;
		if (firstAttributeValueChar === tokens.quote) {
			this._stringParser.next();
			const attributeValueInfos = this._stringParser.navigateUntil(
				nonEscapedValidator(tokens.quote, tokens.escape)
			);
			const attributeValue = attributeValueInfos.text;
			this.registerAttributeValue(attributeValueInfos.range.start, attributeValue);
		} else if (firstAttributeValueChar === tokens.openObjectBracket) {
			this.parseJsonObject();
		}
		if (this.checkCloseTag()) return;
		return this.parseAttributeName();
	}

	private parseJsonObject(): void {
		const jsonParser = new JsonCodeParser(this._stringParser.nextString);
		const jsonParsingResult = jsonParser.parse();
		const attributeName = this._treeParser.attributeNameEdited;
		for (const jsonToken of jsonParsingResult.tokens) {
			let tokenWithContext: AmlTokenWithContext<any>;
			const offset = jsonToken.token.range.start + this._stringParser.offset;
			let type: AmlTokenType;
			if (jsonToken.type === JsonTokenType.KEY) {
				type = AmlTokenType.JSON_KEY;
				const token = new AmlToken(offset, AmlTokenType.JSON_KEY, jsonToken.token.text);
				const context = new AmlJsonKeyCxt();
				context.jsonContext = jsonToken.context;
				context.attributeName = attributeName;
				context.element = this._treeParser.currentElement;
				context.parentElements = this._treeParser.ancestors;
				tokenWithContext = new AmlTokenWithContext(token, context);
			} else if (jsonToken.type === JsonTokenType.STRING_VALUE) {
				const token = new AmlToken(offset, AmlTokenType.JSON_LITERAL_VALUE, jsonToken.token.text);
				const context = new AmlJsonLiteralValueCxt();
				context.jsonContext = jsonToken.context;
				context.attributeName = attributeName;
				context.element = this._treeParser.currentElement;
				context.parentElements = this._treeParser.ancestors;
				tokenWithContext = new AmlTokenWithContext(token, context);
			}
			this._resultBuilder.addToken(tokenWithContext);
		}
		this._stringParser.next(jsonParser.offset);
	}

	private registerTag(offset: number, tag: string): void {
		const token = new AmlToken(offset, AmlTokenType.TAG, tag);
		this._treeParser.openTag(tag);
		const context = new AmlTagNameCxt();
		context.parentElements = this._treeParser.ancestors;
		const tokenWithContext = new AmlTokenWithContext(token, context);
		this._resultBuilder.addToken(tokenWithContext);
	}

	private registerAttributeName(offset: number, name: string): void {
		const token = new AmlToken(offset, AmlTokenType.ATTRIBUTE_NAME, name);
		const context = new AmlAttributeNameCxt();
		context.element = this._treeParser.currentElement;
		context.parentElements = this._treeParser.ancestors;
		const tokenWithContext = new AmlTokenWithContext(token, context);
		this._resultBuilder.addToken(tokenWithContext);
		this._treeParser.addAttributeName(name);
	}

	private registerAttributeValue(offset: number, value: string): void {
		const token = new AmlToken(offset, AmlTokenType.ATTRIBUTE_VALUE, value);
		const attributeName = this._treeParser.attributeNameEdited;
		this._treeParser.addAttributeLiteralValue(value);
		const context = new AmlAttributeValueCxt();
		context.attributeName = attributeName;
		context.element = this._treeParser.currentElement;
		context.parentElements = this._treeParser.ancestors;
		// TODO save context
		const tokenWithContext = new AmlTokenWithContext(token, context);
		this._resultBuilder.addToken(tokenWithContext);
	}
}

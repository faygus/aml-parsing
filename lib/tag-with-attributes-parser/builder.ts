import { ParsingResultBuilder, TokenUnit, ICodeParsingResult } from "code-parsing";
import { Interpretation } from "./types/interpretation";
import { DiagnosticType } from "./types/diagnostic-type";
import { TagToken, Token, Content } from "./types/tokens";
import * as Attribute from "../attribute-parser/types";

export class Builder extends ParsingResultBuilder<Token, DiagnosticType, Interpretation> {
	private _tagToken: TagToken;
	private _attributes: Attribute.Token[] = [];

	addTag(offset: number, name: string): void {
		const tokenUnit = new TokenUnit(name, offset);
		this._tagToken = new TagToken(tokenUnit);
		this._interpretation = new Interpretation();
		this._interpretation.tag = name;
	}

	addAttribute(offset: number, value: ICodeParsingResult<Attribute.Token, Attribute.DiagnosticType, Attribute.Interpretation>): void {
		value.token.incrementOffset(offset);
		this._attributes.push(value.token);
		this._interpretation.attributes.push(value.interpretation);
	}

	getToken(tokenUnit: TokenUnit): Token {
		const content = new Content(this._tagToken, this._attributes);
		return new Token(tokenUnit, content);
	}
}

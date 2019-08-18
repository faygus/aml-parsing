import { ParsingResultBuilder, TokenUnit, ICodeParsingResult } from "code-parsing";
import { Interpretation } from "./types/interpretation";
import { DiagnosticType } from "./types/diagnostic-type";
import { Token, Content } from "./types/tokens";
import * as TagWithAttributes from "../tag-with-attributes-parser/types";

export class Builder extends ParsingResultBuilder<Token, DiagnosticType, Interpretation> {
	private _root: TagWithAttributes.Token;
	private _embededViews: TagWithAttributes.Token[] = [];

	addRootView(offset: number, value: ICodeParsingResult<TagWithAttributes.Token, TagWithAttributes.DiagnosticType, TagWithAttributes.Interpretation>): void {
		value.token.incrementOffset(offset);
		this._root = value.token;
		this._interpretation = new Interpretation();
		this._interpretation.root = value.interpretation;
	}

	getToken(tokenUnit: TokenUnit): Token {
		const content = new Content(this._root, this._embededViews);
		return new Token(tokenUnit, content);
	}
}

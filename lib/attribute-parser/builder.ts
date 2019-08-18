import { ParsingResultBuilder, TokenUnit, ICodeParsingResult } from "code-parsing";
import { Interpretation } from "./types/interpretation";
import { DiagnosticType } from "./types/diagnostic-type";
import { AttributeNameToken, Token, Content, LiteralValueToken } from "./types/tokens";
import { Token as JsonToken } from "../json-parser/types/tokens";
import { JsonDiagnosticType } from "../json-parser/types/diagnostic-type";
import { IKeyValue } from "../json-parser/types/intepretation";
import * as Expression from "../expression-parser/types";

export class Builder extends ParsingResultBuilder<Token, DiagnosticType, Interpretation> {

	private _name: AttributeNameToken;
	private _value: JsonToken | Expression.Token | LiteralValueToken;

	registerAttributeName(offset: number, name: string): void {
		const tokenUnit = new TokenUnit(name, offset);
		this._name = new AttributeNameToken(tokenUnit);
		this._interpretation = new Interpretation();
		this._interpretation.name = name;
	}

	registerAttributeValue(offset: number, value: string): void {
		const tokenUnit = new TokenUnit(value, offset);
		this._value = new LiteralValueToken(tokenUnit);
		this._interpretation.value = value;
	}

	registerJsonValue(offset: number, value: ICodeParsingResult<JsonToken, JsonDiagnosticType, IKeyValue>): void {
		value.token.incrementOffset(offset);
		this._value = value.token;
		this._interpretation.value = value.interpretation;
	}

	registerExpressionValue(offset: number, value: ICodeParsingResult<Expression.Token, Expression.DiagnosticType, Expression.Interpretation>): void {
		value.token.incrementOffset(offset);
		this._value = value.token;
		this._interpretation.value = value.interpretation;
	}

	protected getToken(tokenUnit: TokenUnit): Token {
		const content = new Content(this._name, this._value);
		return new Token(tokenUnit, content);
	}
}

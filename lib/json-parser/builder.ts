import { ParsingResultBuilder, TokenUnit, ICodeParsingResult } from "code-parsing";
import * as Model from "./types/tokens";
import { JsonInterpreter } from "./interpreter/interpreter";
import { IKeyValue } from "./types/intepretation";
import { JsonTreeParser } from "./tree-parser";
import { JsonDiagnosticType } from "./types/diagnostic-type";

export class Builder extends ParsingResultBuilder<Model.Token, JsonDiagnosticType, IKeyValue> {

	private _interpreter = new JsonInterpreter();
	private _treeParser = new JsonTreeParser();
	private _key: Model.KeyToken;
	private _value: Model.LiteralValueToken | Model.ObjectValueToken;

	addKey(offset: number, key: string): void {
		const tokenUnit = new TokenUnit(key, offset);
		this._key = new Model.KeyToken(tokenUnit);
		/*const token = new JsonToken(offset, JsonTokenType.KEY, key);
		const context = new JsonKeyCxt();
		context.parents = this._treeParser.currentElement;
		const tokenWithContext = new JsonTokenWithContext(token, context);*/
		this._treeParser.addKey(key);
		this._interpretation = this._interpreter.addKey(key);
	}

	addRegisterLiteralValue(offset: number, value: string): void {
		const tokenUnit = new TokenUnit(value, offset);
		const context = new Model.ValueContext(this._treeParser.curentKeyEdited);
		this._value = new Model.LiteralValueToken(tokenUnit, context);
		// context.parents = this._treeParser.currentElement;
		this._treeParser.setLiteralValue(value);
		this._interpretation = this._interpreter.setValue(value);
	}

	addObjectValue(offset: number, text: string, parsingResult: ICodeParsingResult<Model.Token, JsonDiagnosticType, IKeyValue>): void {
		const tokenUnit = new TokenUnit(text, offset);
		parsingResult.token.incrementOffset(offset);
		const context = new Model.ValueContext(this._treeParser.curentKeyEdited);
		const content = parsingResult.token.content;
		this._value = new Model.ObjectValueToken(tokenUnit, context, content);
		// TODO merge the treeParser of the parent parser ?
		this._interpretation = this._interpreter.setValue(parsingResult.interpretation);
	}

	getToken(tokenUnit: TokenUnit): Model.Token {
		const content = new Model.Content(this._key, this._value);
		return new Model.Token(tokenUnit, content);
	}
}

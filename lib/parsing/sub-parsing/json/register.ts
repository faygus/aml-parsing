import { ParsingResultBuilder, TokenUnit, ICodeParsingResult } from "code-parsing";
import * as Model from "../../../models/json";
import { JsonInterpreter } from "./interpreter/interpreter";
import { IKeyValue } from "./interpreter/key-value";
import { JsonTreeParser } from "./tree-parser";
import { JsonDiagnosticType } from "./types/diagnostic-type";

export class Register {

	private _interpreter = new JsonInterpreter();
	private _treeParser = new JsonTreeParser();

	constructor(private _resultBuilder: ParsingResultBuilder<Model.Tokens, JsonDiagnosticType, IKeyValue>) {

	}

	addKey(offset: number, key: string): void {
		const tokenUnit = new TokenUnit(key, offset);
		const token = new Model.KeyToken(tokenUnit);
		/*const token = new JsonToken(offset, JsonTokenType.KEY, key);
		const context = new JsonKeyCxt();
		context.parents = this._treeParser.currentElement;
		const tokenWithContext = new JsonTokenWithContext(token, context);*/
		this._resultBuilder.addToken(token);
		this._treeParser.addKey(key);
		const interpretation = this._interpreter.addKey(key);
		this._resultBuilder.setInterpretation(interpretation);
	}

	addRegisterLiteralValue(offset: number, value: string): void {
		const tokenUnit = new TokenUnit(value, offset);
		const context = new Model.ValueContext(this._treeParser.curentKeyEdited);
		const token = new Model.LiteralValueToken(tokenUnit, context);
		// context.parents = this._treeParser.currentElement;
		this._resultBuilder.addToken(token);
		this._treeParser.setLiteralValue(value);
		const interpretation = this._interpreter.setValue(value);
		this._resultBuilder.setInterpretation(interpretation);
	}

	addObjectValue(offset: number, text: string, parsingResult: ICodeParsingResult<Model.Tokens, JsonDiagnosticType, IKeyValue>): void {
		const tokenUnit = new TokenUnit(text, offset);
		const context = new Model.ValueContext(this._treeParser.curentKeyEdited);
		const content = new Model.ObjectTokensList(parsingResult.tokens);
		const token = new Model.ObjectValueToken(tokenUnit, context, content);
		this._resultBuilder.addToken(token);
		// TODO merge the treeParser of the parent parser ?
		const intepretation = this._interpreter.setValue(parsingResult.interpretation);
		this._resultBuilder.setInterpretation(intepretation);
	}
}

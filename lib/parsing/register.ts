import { ICodeParsingResult, ParsingResultBuilder, TokenUnit } from "code-parsing";
import * as Model from "../models/aml";
import { ExpressionTokensList } from "../models/expressions";
import { ObjectTokensList, Tokens as JsonTokens } from "../models/json";
import { AmlInterpretation } from "./interpreter/interpretation";
import { AzogInterpreter } from "./interpreter/interpreter";
import { ExpressionParsingResult } from "./sub-parsing/expression/types/parsing-result";
import { IKeyValue } from "./sub-parsing/json/interpreter/key-value";
import { JsonDiagnosticType } from "./sub-parsing/json/types/diagnostic-type";
import { TreeParser } from "./tree-parser";
import { AmlDiagnosticType } from "./types";
import { AmlParsingResult } from "./types/parsing-result";

export class Register {
	private _treeParser = new TreeParser();
	private _interpreter = new AzogInterpreter();

	constructor(private _resultBuilder: ParsingResultBuilder<any,
		AmlDiagnosticType,
		AmlInterpretation>) {

	}

	registerTag(offset: number, tag: string): void {
		const tokenUnit = new TokenUnit(tag, offset);
		this._treeParser.openTag(tag);
		const token = new Model.TagToken(tokenUnit);
		// context.parentElements = this._treeParser.ancestors;
		this._resultBuilder.addToken(token);
		const interpretation = this._interpreter.addTag(tag);
		this._resultBuilder.setInterpretation(interpretation);
	}

	registerAttributeName(offset: number, name: string): void {
		const tokenUnit = new TokenUnit(name, offset);
		/*context.element = this._treeParser.currentElement;
		context.parentElements = this._treeParser.ancestors;*/
		const context = new Model.AttributeNameCxt(this._treeParser.currentElement.tag);
		const token = new Model.AtributeNameToken(tokenUnit, context);
		this._resultBuilder.addToken(token);
		this._treeParser.addAttributeName(name);
	}

	registerAttributeValue(offset: number, value: string): void {
		const tokenUnit = new TokenUnit(value, offset);
		this._treeParser.addAttributeLiteralValue(value);
		const attributeName = this._treeParser.attributeNameEdited;
		/*context.attributeName = attributeName;
		context.element = this._treeParser.currentElement;
		context.parentElements = this._treeParser.ancestors;*/
		// TODO save context
		const context = this.getAttributeValueContext();
		const token = new Model.AttributeValueToken(tokenUnit, context, undefined);
		this._resultBuilder.addToken(token);
		const interpretation = this._interpreter.addAttribute(attributeName, value);
		this._resultBuilder.setInterpretation(interpretation);
	}

	registerAttributeJSONValue(offset: number, jsonParsingResult: ICodeParsingResult<
		JsonTokens, JsonDiagnosticType, IKeyValue>): void {
		const tokenUnit = new TokenUnit(jsonParsingResult.text, offset);
		const context = this.getAttributeValueContext();
		const content = new ObjectTokensList(jsonParsingResult.tokens);
		const token = new Model.AttributeValueToken(tokenUnit, context, content);
		const attributeName = this._treeParser.attributeNameEdited;
		this._resultBuilder.addToken(token);
		// TODO interpretation
		const interpretation = this._interpreter.addAttribute(attributeName, jsonParsingResult.interpretation);
		this._resultBuilder.setInterpretation(interpretation);
	}

	registerAttributeExpressionValue(offset: number, data: ExpressionParsingResult): void {
		const attributeName = this._treeParser.attributeNameEdited;
		const tokenUnit = new TokenUnit(data.text, offset);
		const context = this.getAttributeValueContext();
		const content = new ExpressionTokensList(data.tokens);
		const token = new Model.AttributeValueToken(tokenUnit, context, content);
		this._resultBuilder.addToken(token);
		const interpretation = this._interpreter.addAttribute(attributeName, data.interpretation);
		this._resultBuilder.setInterpretation(interpretation);
	}

	registerChildNode(offset: number, data: AmlParsingResult): void {
		const tokenUnit = new TokenUnit(data.text, offset);
		const content = new Model.AmlTokensList(data.tokens);
		const token = new Model.NodeToken(tokenUnit, undefined, content);
		this._resultBuilder.addToken(token);
		const interpretation = this._interpreter.addChildNode(data.interpretation);
		this._resultBuilder.setInterpretation(interpretation);
	}

	closeDeclarationTag(): void {
		this._treeParser.closeLastTag();
		this._interpreter.closeTag();
	}

	closeTag(tagName: string): void {
		if (!this._treeParser.closeTag(tagName)) {
			// TODO add token UNMATCHED_CLOSING_TAG
		} else {
			this._interpreter.closeTag();
		}
	}

	private getAttributeValueContext(): Model.AttributeValueCxt {
		const attributeName = this._treeParser.attributeNameEdited;
		const tag = this._treeParser.currentElement.tag;
		const res = new Model.AttributeValueCxt(attributeName, tag);
		return res;
	}
}

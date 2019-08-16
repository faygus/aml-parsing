import * as Model from "../../../models/expressions";
import { TokenUnit, ParsingResultBuilder } from "code-parsing";
import { DiagnosticType } from "./types/diagnostic-type";
import { Interpretation } from "./types/interpretation";

export class Register {
	private _argument: string | Model.VariableIdentifier;

	constructor(private _resultBuilder: ParsingResultBuilder<Model.Tokens, DiagnosticType, Interpretation>) {

	}

	addVariableName(offset: number, name: string): void {
		const tokenUnit = new TokenUnit(name, offset);
		const token = new Model.VariableArgumentToken(tokenUnit);
		this._resultBuilder.addToken(token);
		this._argument = new Model.VariableIdentifier(name);
		const interpretation = new Interpretation();
		interpretation.argument = this._argument;
		this._resultBuilder.setInterpretation(interpretation);
	}

	addStringArgument(offset: number, argument: string): void {
		const tokenUnit = new TokenUnit(argument, offset);
		const token = new Model.LiteralArgumentToken(tokenUnit);
		this._resultBuilder.addToken(token);
		this._argument = argument;
		const interpretation = new Interpretation();
		interpretation.argument = this._argument;
		this._resultBuilder.setInterpretation(interpretation);
	}

	addPipeName(offset: number, pipe: string): void {
		const tokenUnit = new TokenUnit(pipe, offset);
		const ctx = new Model.PipeCxt(this._argument);		
		const token = new Model.PipeToken(tokenUnit, ctx);
		this._resultBuilder.addToken(token);
		const interpretation = new Interpretation();
		interpretation.argument = this._argument;
		interpretation.pipeIdentifier = pipe;
		this._resultBuilder.setInterpretation(interpretation);
	}
}

import { Token } from "./types/tokens";
import { DiagnosticType } from "./types/diagnostic-type";
import { Interpretation } from "./types/interpretation";
import * as Model from "./types/tokens";
import { TokenUnit, ParsingResultBuilder } from "code-parsing";

export class Builder extends ParsingResultBuilder<Token, DiagnosticType, Interpretation> {
	private _argument: string | Model.VariableIdentifier;
	private _argumentToken: Model.VariableArgumentToken | Model.LiteralArgumentToken;
	private _pipeToken: Model.PipeToken;

	addVariableName(offset: number, name: string): void {
		const tokenUnit = new TokenUnit(name, offset);
		this._argumentToken = new Model.VariableArgumentToken(tokenUnit);
		this._argument = new Model.VariableIdentifier(name);
		this._interpretation = new Interpretation();
		this._interpretation.argument = this._argument;
	}

	addStringArgument(offset: number, argument: string): void {
		const tokenUnit = new TokenUnit(argument, offset);
		this._argumentToken = new Model.LiteralArgumentToken(tokenUnit);
		this._argument = argument;
		this._interpretation = new Interpretation();
		this._interpretation.argument = this._argument;
	}

	addPipeName(offset: number, pipe: string): void {
		const tokenUnit = new TokenUnit(pipe, offset);
		this._pipeToken = new Model.PipeToken(tokenUnit);
		this._interpretation = new Interpretation();
		this._interpretation.argument = this._argument;
		this._interpretation.pipeIdentifier = pipe;
	}

	protected getToken(tokenUnit: TokenUnit): Token {
		const content = new Model.Content(this._argumentToken, this._pipeToken);
		const res = new Token(tokenUnit, content);
		return res;
	}
}

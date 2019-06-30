import { ICodeParsingResult } from "../interfaces/i-code-parsing-result";
import { IDiagnostic } from "../interfaces/i-diagnostic";
import { IToken } from "../interfaces/i-token";
import { ParsingResult } from "./parsing-result";

export class ParsingResultBuilder<
	TokenWithContextType extends { token: IToken<any>, context: any },
	DiagnosticType,
	InterpretationType> {

	protected _tokens: TokenWithContextType[] = [];
	protected _diagnostics: IDiagnostic<DiagnosticType>[] = [];
	protected _interpretation: InterpretationType;

	addToken(token: TokenWithContextType): void {
		this._tokens.push(token);
	}

	addDiagnostic(diagnostic: IDiagnostic<DiagnosticType>): void {
		this._diagnostics.push(diagnostic);
	}

	getResult(): ICodeParsingResult<TokenWithContextType, DiagnosticType, InterpretationType> {
		return new ParsingResult(this._tokens, this._diagnostics, this._interpretation);
	}

	setInterpretation(value: InterpretationType): void {
		this._interpretation = value;
	}

	merge(data: ICodeParsingResult<TokenWithContextType, DiagnosticType, InterpretationType>, offset: number): void {
		this._tokens.push(...data.tokens.map(t => {
			(<any>t.token)._offset += offset; // TODO
			return t;
		}));
		this._diagnostics.push(...data.diagnostics.map(d => {
			d.offset += offset;
			return d;
		}));
	}
}

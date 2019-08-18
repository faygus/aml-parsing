import { ParsingResultBuilder, ICodeParsingResult, TokenUnit } from "code-parsing";
import { Token, Content } from "./types/tokens";
import { DiagnosticType } from "./types/diagnostic-type";
import {
	PropsToken,
	Interpretation as PropsInterpretation,
	DiagnosticType as PropsDiagnosticType
} from "data-interface-parser";
import { Interpretation } from "./types/interpretation";
import * as Template from "../template-parser/types";

export class Builder extends ParsingResultBuilder<Token, DiagnosticType, Interpretation> {

	private _dataInterface: PropsToken;
	private _viewTemplate: Template.Token;

	addDataInterface(offset: number, data: ICodeParsingResult<PropsToken, PropsDiagnosticType, PropsInterpretation>): void {
		// TODO set offset
		data.token.incrementOffset(offset);
		this._dataInterface = data.token;
		this._interpretation = new Interpretation();
		this._interpretation.props = data.interpretation.props;
	}

	addTemplate(offset: number, value: ICodeParsingResult<Template.Token, Template.DiagnosticType, Template.Interpretation>): void {
		value.token.incrementOffset(offset);
		this._viewTemplate = value.token;
		this._interpretation.template = value.interpretation;
	}

	getToken(tokenUnit: TokenUnit): Token {
		const content = new Content(this._dataInterface, this._viewTemplate);
		return new Token(tokenUnit, content);
	}
}

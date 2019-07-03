import { ICodeParsingResult } from "../../interfaces";
import { Tokens } from "../../models/aml";
import { AmlDiagnosticType } from "./diagnostic-type";
import { AmlInterpretation } from "../interpreter/interpretation";

export type AmlParsingResult = ICodeParsingResult<
	Tokens, AmlDiagnosticType, AmlInterpretation>;

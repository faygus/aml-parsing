import { ICodeParsingResult } from "./i-code-parsing-result";

export type ICodeParser<T, U> = (data: string) => ICodeParsingResult<T, U>;

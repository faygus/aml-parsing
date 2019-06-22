import { ICodeParsingResult } from "./i-code-parsing-result";

export type ICodeParser<T> = (data: string) => ICodeParsingResult<T>;

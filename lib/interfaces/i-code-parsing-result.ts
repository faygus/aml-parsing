import { IToken } from "./i-token";

export interface ICodeParsingResult<T> {
	getTokenAt(offset: number): IToken<T> | undefined;
	tokens: IToken<T>[];
}

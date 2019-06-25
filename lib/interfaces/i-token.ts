import { Range } from "../utils/range";

export interface IToken<T> {
	range: Range;
	type: T;
	text: string;
}

export interface ITokenWithContext<T, U> {
	token: IToken<T>;
	context: U;
}

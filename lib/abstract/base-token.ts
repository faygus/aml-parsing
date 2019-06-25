import { Range } from "../utils/range";
import { IToken, ITokenWithContext } from "../interfaces/i-token";

export abstract class BaseToken<T> implements IToken<T> {
	constructor(protected _offset: number, public type: T, public text: string) {

	}

	get range(): Range {
		return new Range(this._offset, this._offset + this.text.length);
	}
}

export abstract class BaseTokenWithContext<T, U> implements ITokenWithContext<T, U> {

	constructor(public token: IToken<T>, public context: U) {

	}

	get type(): T {
		return this.token.type;
	}
}

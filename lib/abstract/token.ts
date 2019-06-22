import { Range } from "../utils/range";
import { IToken } from "../interfaces/i-token";

export abstract class BaseToken<T> implements IToken<T> {
	constructor(protected _offset: number, public type: T, public text: string) {

	}

	get range(): Range {
		return new Range(this._offset, this._offset + this.text.length);
	}
}

import { AnyParsingResult } from "../../interfaces/i-code-parsing-result";
import { BaseToken } from "./base-token";

export abstract class ComplexToken<T, U extends AnyParsingResult> extends BaseToken<T> {
	constructor(offset: number, type: T, public content: U) {
		super(offset, type, content.text);
	}
}

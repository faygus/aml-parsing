import { Range } from "../utils/range";

export class TokenUnit {
	constructor(public text: string, public offset: number) {

	}

	get range(): Range {
		return new Range(this.offset, this.offset + this.text.length);
	}
}

export abstract class Token {
	constructor(public tokenUnit: TokenUnit) {
	}
}

export abstract class TokenWithContext<T> extends Token {
	constructor(tokenUnit: TokenUnit, public context: T) {
		super(tokenUnit);
	}
}

export abstract class TokenWithContent<T, U extends GroupOfTokens<any> | undefined> extends TokenWithContext<T> {
	constructor(tokenUnit: TokenUnit, context: T, public content: U) {
		super(tokenUnit, context);
	}
}

export abstract class GroupOfTokens<T extends Token> {
	constructor(public tokens: T[]) {
	}

	getTokenAt(offset: number): T {
		for (const tokenWithContext of this.tokens) {
			const token = tokenWithContext.tokenUnit;
			if (offset < token.range.start) {
				return undefined;
			}
			if (offset <= token.range.end) {
				return tokenWithContext;
			}
		}
		return undefined;
	}
}

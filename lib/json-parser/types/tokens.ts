import { Token as BaseToken, TokenUnit } from "code-parsing";

export class KeyToken extends BaseToken {
}

export class LiteralValueToken extends BaseToken {
	constructor(tokenUnit: TokenUnit, public context: ValueContext) {
		super(tokenUnit);
	}
}

export class ObjectValueToken extends BaseToken {
	constructor(tokenUnit: TokenUnit, public context: ValueContext, public content: Content) {
		super(tokenUnit);
	}

	protected getContent(): BaseToken[] {
		return [this.content.key, this.content.value];
	}
}

export class ValueContext {
	constructor(public key: string) {
	}
}

export class Token extends BaseToken {
	constructor(tokenUnit: TokenUnit, public content: Content) {
		super(tokenUnit);
	}

	protected getContent(): BaseToken[] {
		return [this.content.key, this.content.value];
	}
}

export class Content {
	constructor(public key: KeyToken,
		public value: LiteralValueToken | ObjectValueToken) {

		}
}

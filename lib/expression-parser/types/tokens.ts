import { Token as BaseToken, TokenUnit } from "code-parsing";

export class Token extends BaseToken {
	constructor(tokenUnit: TokenUnit, public content: Content) {
		super(tokenUnit);
	}

	protected getContent(): BaseToken[] {
		return [this.content.argument, this.content.pipe];
	}
}

//

export class VariableArgumentToken extends BaseToken {
}

export class LiteralArgumentToken extends BaseToken {
}

export class PipeToken extends BaseToken {
}

//

export class Content {
	constructor(public argument: LiteralArgumentToken | VariableArgumentToken,
		public pipe?: PipeToken) {

	}
}

export class VariableIdentifier {
	constructor(public name: string) { }
}

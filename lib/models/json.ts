import { Token, GroupOfTokens, TokenWithContext, TokenWithContent } from "code-parsing";

export class KeyToken extends Token {
}

export class LiteralValueToken extends TokenWithContext<ValueContext> {
}

export class ObjectValueToken extends TokenWithContent<ValueContext, ObjectTokensList> {
}

export class ValueContext {
	constructor(public key: string) {
	}
}

export type Tokens = KeyToken | LiteralValueToken | ObjectValueToken;

// group of tokens inside a json object
export class ObjectTokensList extends GroupOfTokens<Tokens> {
}

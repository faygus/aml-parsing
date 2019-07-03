import { Token, TokenWithContent, TokenWithContext, GroupOfTokens } from "./tokens";
import { ExpressionTokens } from "./expressions";
import { ObjectTokens } from "./json";

export class TagToken extends Token {
}

export class AtributeNameToken extends TokenWithContext<AttributeNameCxt> {
}

export class AttributeValueToken extends TokenWithContent<AttributeValueCxt, AttributeValueTokenContent> {
}


export type AttributeValueTokenContent = ExpressionTokens | ObjectTokens | undefined;

// context

export class AttributeNameCxt {
	constructor(public tag: string) {
	}
}

export class AttributeValueCxt {
	constructor(public attributeName: string, public tag: string) {
	}
}

export type Tokens = TagToken | AtributeNameToken | AttributeValueToken;

export class AmlTokens extends GroupOfTokens<Tokens> {
}

import { Token, TokenWithContent, TokenWithContext, GroupOfTokens } from "./tokens";
import { ExpressionTokensList } from "./expressions";
import { ObjectTokensList } from "./json";

export class NodeToken extends TokenWithContent<undefined, AmlTokensList> {
}

export class TagToken extends Token {
}

export class AtributeNameToken extends TokenWithContext<AttributeNameCxt> {
}

export class AttributeValueToken extends TokenWithContent<AttributeValueCxt, AttributeValueTokenContent> {
}


export type AttributeValueTokenContent = ExpressionTokensList | ObjectTokensList | undefined;

// context

export class AttributeNameCxt {
	constructor(public tag: string) {
	}
}

export class AttributeValueCxt {
	constructor(public attributeName: string, public tag: string) {
	}
}

export type Tokens = NodeToken | TagToken | AtributeNameToken | AttributeValueToken;

export class AmlTokensList extends GroupOfTokens<Tokens> {
}

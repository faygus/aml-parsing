import { Token as BaseToken, TokenUnit } from "code-parsing";
import { Token as AttributeToken } from "../../attribute-parser/types/tokens";

export class TagToken extends BaseToken {
}

export class Token extends BaseToken {
	constructor(tokenUnit: TokenUnit, public content: Content) {
		super(tokenUnit);
	}

	protected getContent(): BaseToken[] {
		return [...this.content.attributes, this.content.tag];
	}
}

export class Content {
	constructor(public tag: TagToken, public attributes: AttributeToken[]) {

	}
}

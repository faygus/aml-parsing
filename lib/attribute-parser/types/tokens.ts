import { Token as BaseToken, TokenUnit } from "code-parsing";
import { Token as JsonToken } from "../../json-parser/types/tokens";
import { Token as  ExpressionToken } from "../../expression-parser/types/tokens";

export class AttributeNameToken extends BaseToken {
}

export class LiteralValueToken extends BaseToken {

}

export class Token extends BaseToken {
	constructor(tokenUnit: TokenUnit, public content: Content) {
		super(tokenUnit);
	}

	protected getContent(): BaseToken[] {
		return [this.content.attributeName, this.content.value];
	}
}

export class Content {
	constructor(public attributeName: AttributeNameToken,
		public value: JsonToken | ExpressionToken | LiteralValueToken) {

	}
}

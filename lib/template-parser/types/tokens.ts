import { Token as BaseToken, TokenUnit } from "code-parsing";
import { Token as TagWithAttributesToken } from "../../tag-with-attributes-parser/types/tokens";


export class Token extends BaseToken {
	constructor(tokenUnit: TokenUnit, public content: Content) {
		super(tokenUnit);
	}

	protected getContent(): BaseToken[] {
		return [this.content.root, ...this.content.embededViews];
	}
}

export class Content {
	constructor(public root: TagWithAttributesToken, public embededViews: TagWithAttributesToken[]) {

	}
}

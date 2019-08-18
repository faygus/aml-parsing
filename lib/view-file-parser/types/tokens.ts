import { Token as BaseToken, TokenUnit } from "code-parsing";
import { PropsToken } from "data-interface-parser";
import { Token as ViewTemplateToken } from "../../template-parser/types/tokens";

export class Token extends BaseToken {
	constructor(tokenUnit: TokenUnit, public content: Content) {
		super(tokenUnit);
	}

	protected getContent(): BaseToken[] {
		return [this.content.properties, this.content.viewTemplate];
	}
}

export class Content {
	constructor(public properties: PropsToken,
		public viewTemplate: ViewTemplateToken) {

	}
}

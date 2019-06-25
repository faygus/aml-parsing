import { BaseToken, BaseTokenWithContext } from "../../abstract/base-token";
import { AmlTokenType } from "./token-type";
import { AmlTagNameCxt } from "./context/tag-name";
import { AmlAttributeNameCxt } from "./context/attribute-name";
import { AmlAttributeValueCxt } from "./context/attribute-value";
import { AmlJsonKeyCxt } from "./context/json-key";
import { AmlJsonLiteralValueCxt } from "./context/json-literal-value";

export class AmlToken<T extends AmlTokenType> extends BaseToken<T> {
}

export interface IContextElementTypeMap {
	[AmlTokenType.TAG]: AmlTagNameCxt;
	[AmlTokenType.ATTRIBUTE_NAME]: AmlAttributeNameCxt;
	[AmlTokenType.ATTRIBUTE_VALUE]: AmlAttributeValueCxt;
	[AmlTokenType.JSON_KEY]: AmlJsonKeyCxt;
	[AmlTokenType.JSON_LITERAL_VALUE]: AmlJsonLiteralValueCxt;
}

export class AmlTokenWithContext<T extends keyof IContextElementTypeMap>
	extends BaseTokenWithContext<T, IContextElementTypeMap[T]> {

}

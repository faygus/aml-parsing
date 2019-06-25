import { BaseToken, BaseTokenWithContext } from "../../abstract/base-token";
import { JsonTokenType } from "./token-type";
import { JsonKeyCxt } from "./context/key";
import { JsonPropertyValueCxt } from "./context/value";

export class JsonToken<T extends JsonTokenType> extends BaseToken<T> {
}

export interface IContextElementTypeMap {
	[JsonTokenType.KEY]: JsonKeyCxt;
	[JsonTokenType.STRING_VALUE]: JsonPropertyValueCxt;
}

export class JsonTokenWithContext<T extends keyof IContextElementTypeMap>
	extends BaseTokenWithContext<T, IContextElementTypeMap[T]> {

}

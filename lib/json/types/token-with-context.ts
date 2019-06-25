import { JsonTokenWithContext } from "./token";
import { JsonTokenType } from "./token-type";

export type JsonTokenWithContextTypes = JsonTokenWithContext<JsonTokenType.KEY> |
	JsonTokenWithContext<JsonTokenType.STRING_VALUE>;
// ...

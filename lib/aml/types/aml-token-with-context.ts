import { AmlTokenWithContext } from "./aml-token";
import { AmlTokenType } from "./token-type";

export type AmlTokenWithContextTypes = AmlTokenWithContext<AmlTokenType.TAG> |
	AmlTokenWithContext<AmlTokenType.ATTRIBUTE_NAME> |
	AmlTokenWithContext<AmlTokenType.ATTRIBUTE_VALUE> |
	AmlTokenWithContext<AmlTokenType.JSON_KEY> |
	AmlTokenWithContext<AmlTokenType.JSON_LITERAL_VALUE>;
// ...

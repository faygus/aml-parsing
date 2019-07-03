export enum AmlTokenType {
	TAG,
	ATTRIBUTE_NAME,
	ATTRIBUTE_VALUE,
	JSON_KEY,
	JSON_LITERAL_VALUE
	// ...
}

const TokenType = {
	tag: AmlTokenType.TAG,
	attribute: {
		name: AmlTokenType.ATTRIBUTE_NAME,
		
	}
}
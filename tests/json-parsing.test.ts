import { parseJsonCode } from "../lib/json/json-parser";
import { JsonToken } from "../lib/json/types/token";
import { JsonTokenType } from "../lib/json/types/token-type";

describe('Json parsing', () => {

	test('should parse json', () => {
		const data = `{
	foo: "hello world"
}`;
		const res = parseJsonCode(data);
		const token1 = new JsonToken(3, JsonTokenType.KEY, 'foo');
		const token2 = new JsonToken(9, JsonTokenType.STRING_VALUE, 'hello world');
		const expectedTokens = [token1, token2];
		expect(JSON.stringify(res.tokens)).toEqual(JSON.stringify(expectedTokens));
	});

	test('should parse json with nested object', () => {
		const data = `{
	foo: {
		bar: "hey man"
	},
	hello: "yeah !!!!"
}`;
		const res = parseJsonCode(data);
		const token1 = new JsonToken(3, JsonTokenType.KEY, 'foo');
		const token2 = new JsonToken(12, JsonTokenType.KEY, 'bar');
		const token3 = new JsonToken(18, JsonTokenType.STRING_VALUE, 'hey man');
		const token4 = new JsonToken(32, JsonTokenType.KEY, 'hello');
		const token5 = new JsonToken(40, JsonTokenType.STRING_VALUE, 'yeah !!!!');
		const expectedTokens = [token1, token2, token3, token4, token5];
		expect(JSON.stringify(res.tokens)).toEqual(JSON.stringify(expectedTokens));
	});
});

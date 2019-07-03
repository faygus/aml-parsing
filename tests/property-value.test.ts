import { ExpressionParser } from "../lib/parsing/sub-parsing/expression/parser";

describe('Property value parsing', () => {

	test('should parse property value', () => {
		const data = `$prop1 |	myPipe`;
		const parser = new ExpressionParser(data);
		const res = parser.parse();
		const expected = JSON.parse(`{
			"_tokens": [
				{
					"token": {
						"_offset": 1,
						"type": 0,
						"text": "prop1"
					}
				},
				{
					"token": {
						"_offset": 9,
						"type": 2,
						"text": "myPipe"
					},
					"context": {
						"src": {
							"name": "prop1"
						}
					}
				}
			],
			"_diagnostics": [],
			"_interpretation": {
				"argument": {
					"name": "prop1"
				},
				"pipeIdentifier": "myPipe"
			}
		}`);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});
});

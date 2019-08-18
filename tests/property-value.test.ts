import { Parser } from "../lib/expression-parser/parser";

describe('Property value parsing', () => {

	test('should parse property value', () => {
		/*const data = `$prop1 | myPipe`;
		const parser = new Parser(data);
		const res = parser.parse();
		const expected = JSON.parse(`{
			"text":"$prop1 | myPipe",
			"_tokens":[
				{
					"tokenUnit":{
						"text":"prop1",
						"offset":1
					}
				},
				{
					"tokenUnit":{
						"text":"myPipe",
						"offset":9
					},
					"context":{
						"variable":{
							"name":"prop1"
						}
					}
				}
			],
			"_diagnostics":[],
			"_interpretation":{
				"argument":{
					"name":"prop1"
				},
				"pipeIdentifier":"myPipe"
			}
		}`);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));*/
	});
});

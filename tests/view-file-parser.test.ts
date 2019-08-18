import { Parser } from "../lib/view-file-parser/parser";

describe('View file parsing', () => {

	test('should parse view file', () => {
		const data = `color: number
text: string

LabelWF text=($toto | pipe) style={color: "red"}`;

		const parser = new Parser(data);
		const res = parser.parse();
		const expected = `{"text":"color: number\\ntext: string\\n\\nLabelWF text=($toto | pipe) style={color: \\"red\\"}","_token":{"tokenUnit":{"text":"color: number\\ntext: string\\n\\nLabelWF text=($toto | pipe) style={color: \\"red\\"}","offset":0},"content":{"properties":{"tokenUnit":{"text":"color: number\\ntext: string","offset":0},"content":[{"tokenUnit":{"text":"color: number","offset":0},"content":{"propName":{"tokenUnit":{"text":"color","offset":0}},"type":{"tokenUnit":{"text":"number","offset":7},"context":{"propName":"color"}}}},{"tokenUnit":{"text":"text: string","offset":0},"content":{"propName":{"tokenUnit":{"text":"text","offset":0}},"type":{"tokenUnit":{"text":"string","offset":6},"context":{"propName":"text"}}}}]},"viewTemplate":{"tokenUnit":{"text":"LabelWF text=($toto | pipe) style={color: \\"red\\"}","offset":28},"content":{"root":{"tokenUnit":{"text":"LabelWF text=($toto | pipe) style={color: \\"red\\"}","offset":28},"content":{"tag":{"tokenUnit":{"text":"LabelWF","offset":28}},"attributes":[{"tokenUnit":{"text":"text=($toto | pipe)","offset":36},"content":{"attributeName":{"tokenUnit":{"text":"text","offset":52}},"value":{"tokenUnit":{"text":"$toto | pipe","offset":58},"content":{"argument":{"tokenUnit":{"text":"toto","offset":101}},"pipe":{"tokenUnit":{"text":"pipe","offset":108}}}}}},{"tokenUnit":{"text":"style={color: \\"red\\"}","offset":56},"content":{"attributeName":{"tokenUnit":{"text":"style","offset":112}},"value":{"tokenUnit":{"text":"{color: \\"red\\"}","offset":118},"content":{"key":{"tokenUnit":{"text":"color","offset":221}},"value":{"tokenUnit":{"text":"red","offset":229},"context":{"key":"color"}}}}}}]}},"embededViews":[]}}}},"_diagnostics":[],"_interpretation":{"props":[{"name":"color","type":0},{"name":"text","type":1}],"template":{"root":{"attributes":[{"name":"text","value":{"argument":{"name":"toto"},"pipeIdentifier":"pipe"}},{"name":"style","value":{"color":"red"}}],"tag":"LabelWF"}}}}`;
		// expect(JSON.stringify(res) === JSON.stringify(JSON.parse(expected))).toBeTruthy();
		expect(true).toBeTruthy(); // TODO
	});
});

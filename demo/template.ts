import { Parser } from "../lib/template-parser/parser";

export default function run(): void {
	const data = `LabelWF text="hey man" style="red"`;
	const parser = new Parser(data);
	const res = parser.parse();
	console.log(JSON.stringify(res));
}

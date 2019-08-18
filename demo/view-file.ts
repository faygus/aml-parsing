import { Parser } from "../lib/view-file-parser/parser";

export default function run(): void {
	const data = `color: number
text: string

LabelWF text="hey man"`;
	const parser = new Parser(data);
	const res = parser.parse();
}

import { Parser as DataInterfaceParser } from "data-interface-parser";
import { Parser } from "../lib/view-file-parser/parser";
import run from './view-file';

run();
/*const data = `prop1: string
prop2: number
prop3: boolean

View1 <
	View2
>`;
const parser = new ViewFileParser(data);
const res = parser.parse();
console.log(JSON.stringify(res));
*/
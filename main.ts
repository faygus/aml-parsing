import { parseAmlCode } from "./lib/aml/parser";
import { parseJsonCode } from "./lib/json/json-parser";


const data = `{
	foo: {
		bar: "hey man"
	},
	hello: "yeah !!!!"
}`;
const res = parseJsonCode(data);
console.log(res);

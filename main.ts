import { parseAmlCode } from "./lib/aml/parsing/parser";
import { parseJsonCode } from "./lib";


const data = `{toto: {tata: ""`;
const res = parseJsonCode(data);
console.log(JSON.stringify(res.getTokenAt(15)));

// console.log(JSON.stringify(res));

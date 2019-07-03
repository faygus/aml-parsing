import { AmlParser } from "./lib/parsing/parser";
import { parseJsonCode } from "./lib";
import { KeyToken } from "./lib/models/json";
import { ExpressionParser } from "./lib/parsing/sub-parsing/expression/parser";

// const data = `<LabelWF text=($prop1 |     pipe1)/>`;

/*const data = `<LabelWF text=($prop1 |     pipe1)/>`;
const parser = new AmlCodeParser(data);
const res = parser.parse();
console.log(JSON.stringify(res.interpretation));*/

const data = `<Layout direction="row">
	<Label text=($foo | bar)/>
</Layout>`;
const parser = new AmlParser(data);
const res = parser.parse();
console.log('res', JSON.stringify(res));

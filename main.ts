import { parseAmlCode } from "./lib/aml/parser";


const data = `<Layout direction="row">
	<Label text="hey man" style={color:"black", size:"small"}/>
</Layout>`;
const res = parseAmlCode(data);
console.log(JSON.stringify(res));

import { parseAmlCode } from "./src/aml/parser";

const data = `<Layout direction="row">
	<Label text="hey man"/>
</Layout>`;
const parsingResult = parseAmlCode(data);
console.log('parsingResult', parsingResult);
/*const token = parsingResult.getTokenAt(10); //36);
console.log(token);
*/
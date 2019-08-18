import { IKeyValue } from "../../json-parser/types/intepretation";
import { Interpretation as Expression } from "../../expression-parser/types/interpretation";

export class Interpretation {
	name: string;
	value: IKeyValue | Expression | string;
}

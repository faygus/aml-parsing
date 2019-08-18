import { Property } from "data-interface-parser";
import { Interpretation as Template } from "../../template-parser/types/interpretation";

export class Interpretation {
	props: Property[];
	template: Template;
}

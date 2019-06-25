import { JsonPropertyValueCxt } from "../../../json/types/context/value";
import { AmlElement } from "./utils/element";
import { IAmlElementsTree } from "./utils/elements-tree";

export class AmlJsonLiteralValueCxt {
	attributeName: string;
	jsonContext: JsonPropertyValueCxt;
	element: AmlElement;
	parentElements: IAmlElementsTree;
}

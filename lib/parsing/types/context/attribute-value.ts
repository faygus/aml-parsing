import { AmlElement } from "./utils/element";
import { IAmlElementsTree } from "./utils/elements-tree";

export class AmlAttributeValueCxt {
	attributeName: string;
	element: AmlElement;
	parentElements: IAmlElementsTree;
}

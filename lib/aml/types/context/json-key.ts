import { AmlElement } from "./utils/element";
import { IAmlElementsTree } from "./utils/elements-tree";
import { JsonKeyCxt } from "../../../json/types/context/key";

export class AmlJsonKeyCxt {
	attributeName: string;
	jsonContext: JsonKeyCxt;
	element: AmlElement;
	parentElements: IAmlElementsTree;
}

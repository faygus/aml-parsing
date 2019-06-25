import { AmlElement, AmlAttribute, IAmlAttributes } from "../types/context/utils/element";
import { BaseBuilder } from "../../abstract/builder";

export class AmlElementBuilder extends BaseBuilder<AmlElement> {

	public attributes: IAmlAttributes = [];

	constructor(public tag: string) {
		super();
	}

	addAttribute(name: string, value: string): void {
		const attribute = new AmlAttribute();
		attribute.name = name;
		attribute.value = value;
		this.attributes.push(attribute);
	}

	addAttributeName(name: string): void {
		this.addAttribute(name, undefined);
	}

	get editedAttribute(): AmlAttribute | undefined {
		if (this.attributes.length === 0) return undefined;
		return this.attributes.slice().reverse()[0];
	}

	getResult(): AmlElement {
		const res = new AmlElement();
		res.tag = this.tag;
		res.attributes = [...this.attributes];
		return res;
	}
}

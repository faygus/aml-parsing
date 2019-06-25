export class AmlElement {
	tag: string;
	attributes: IAmlAttributes;

	constructor(tag?: string) {
		this.tag = tag;
	}
}

export type IAmlAttributes = AmlAttribute[];

export class AmlAttribute {
	name: string;
	value: string | AmlAttribute[];
}

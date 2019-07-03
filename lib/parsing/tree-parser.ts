import { AmlElementBuilder } from "./builder/element";
import { AmlElement } from "./types/context/utils/element";

export class TreeParser {

	private _nodes: AmlElementBuilder[] = [];

	getLastParentNode(): AmlElementBuilder | undefined {
		if (this._nodes.length === 0) return undefined;
		return this._nodes.slice().reverse()[0];
	}

	/**
	 * returns false if the closing tag doesn't match the current opened tag
	 */
	closeTag(tagName: string): boolean {
		if (this._nodes.length === 0) {
			return false;
		}
		if (this._nodes.slice().reverse()[0].tag !== tagName) {
			return false;
		}
		this._nodes.pop();
		return true;
	}

	closeLastTag() {
		this._nodes.pop();
	}

	hasTagsOpened(): boolean {
		return this._nodes.length > 0;
	}

	openTag(tag: string): void {
		const element = new AmlElementBuilder(tag);
		this._nodes.push(element);
	}

	addAttribute(name: string, value: string): void {
		const current = this._currentElement;
		if (!current) return;
		current.addAttribute(name, value);
	}

	addAttributeName(name: string): void {
		const current = this._currentElement;
		if (!current) return;
		current.addAttributeName(name);
	}

	addAttributeLiteralValue(value: string): void {
		const current = this._currentElement;
		if (!current) return;
		const attribute = current.editedAttribute;
		if (!attribute) {
			return;
		}
		attribute.value = value;
	}

	get attributeNameEdited(): string | undefined {
		const current = this._currentElement;
		if (!current) return;
		const attribute = current.editedAttribute;
		if (!attribute) {
			return undefined;
		}
		return attribute.name;
	}

	get currentElement(): AmlElement | undefined {
		const res = this._currentElement;
		if (res === undefined) return undefined;
		return res.getResult();
	}

	get ancestors(): AmlElement[] { // the direct parent is at index 0
		if (this._nodes.length <= 1) {
			return [];
		}
		return this._nodes.slice().reverse().slice(1).map(a => a.getResult());
	}

	private get _currentElement(): AmlElementBuilder | undefined {
		if (this._nodes.length === 0) return undefined;
		return this._nodes.slice().reverse()[0];
	}
}

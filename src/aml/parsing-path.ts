export class ParsingPath {

	private _nodes: string[] = [];

	getLastParentNode(): string | undefined {
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
		if (this._nodes.slice().reverse()[0] !== tagName) {
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
}

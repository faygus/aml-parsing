import { IJsonData, IJsonAttribute, IJsonAttributes } from "./json-data";
import { StringUtils } from "../../utils/string-utils";

export class AzogInterpreter {
	private _array: IJsonData[] = [];
	private _result: IJsonData;

	addTag(tag: string): IJsonData {
		const parent = this.getLast();
		const node: IJsonData = {
			tag: StringUtils.antiCapitalize(tag),
			attributes: {},
			children: []
		};
		if (parent) {
			parent.children.push(node);
		} else {
			this._result = node;
		}
		this._array.push(node);
		return this._result;
	}

	addAttribute(name: string, value: any): IJsonData {
		const last = this.getLast();
		if (!last) return this._result;
		last.attributes[name] = value;
		return this._result;
	}

	closeTag(): void {
		this._array.pop();
	}

	getResult(): IJsonData {
		return this._result;
	}

	private getLast(): IJsonData | undefined {
		if (this._array.length === 0) return undefined;
		return this._array.slice().reverse()[0];
	}
}

export const errors = {
	tagNotValid: (tag: string) => {
		return new Error(`tag ${tag} is not valid`);
	},
	compexAtributeNotWrappedCorrectly: (tag1: string, tag2: string) => {
		return new Error(`${tag1}.${tag2} should be wrapped in a ${tag1} element`);
	}
};

export function parseJsonString(data: string): any {
	const correctJson = data.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2":') // add "" around keys
		.replace(/: '([a-z0-9A-Z_ ]+)'([,$])?/g, ': "$1"$2'); // replace '' by "" for values
	return JSON.parse(correctJson);
}

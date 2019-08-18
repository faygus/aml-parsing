import { IKeyValue } from "../types/intepretation";

export class JsonInterpreter {
	private _result: IKeyValue;

	addKey(key: string): IKeyValue {
		if (!this._result) {
			this._result = {};
		}
		this._result[key] = undefined;
		return this._result;
	}

	setValue(value: any): IKeyValue {
		const keys = Object.keys(this._result);
		if (keys.length === 0) return;
		const lastKey = keys.reverse()[0];
		this._result[lastKey] = value;
		return this._result;
	}

	getResult(): IKeyValue {
		return this._result;
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

import { JsonElement, JsonProperty } from "./types/context/utils/element";

export class JsonTreeParser {
	private _object = new JsonElement();

	get curentKeyEdited(): string | undefined {
		if (this._object.properties.length === 0) return undefined;
		return this._object.properties.reverse()[0].name;
	}

	get currentElement(): JsonElement {
		return this.clone(this._object);
	}

	addKey(key: string): void {
		this._object.properties.push(new JsonProperty(key));
	}

	setLiteralValue(value: string): void {
		if (this._object.properties.length === 0) return;
		this._object.properties.reverse()[0].value = value;
	}

	private clone(data: JsonElement): JsonElement {
		// if (data.properties.length === 0) return undefined;
		const res = new JsonElement();
		res.properties = data.properties.map(p => {
			const prop = new JsonProperty(p.name);
			if (p.value === undefined) {
				return prop;
			}
			if (typeof p.value === 'string') {
				prop.value = p.value;
			} else {
				prop.value = this.clone(p.value);
			}
			return prop;
		});
		return res;
	}
}

export class JsonElement {
	properties: IJsonProperties = [];
}

export type IJsonProperties = JsonProperty[];

export class JsonProperty {
	name: string;
	value: JsonElement | string;

	constructor(name?: string) {
		if (name) {
			this.name = name;
		}
	}
}

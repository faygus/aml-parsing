import { StringUtils } from "./string-utils";
import { StringValidator } from "./string-validator";
import { StringNavigationInfos } from "./string-navigation-infos";

export class StringParser {
	private _offset = 0;

	constructor(private _data: string) {

	}

	navigateToFirstNonEmptyChar(): StringParser {
		for (const char of this.nextString) {
			if (StringUtils.charIsEmpty(char)) {
				this._offset++;
				continue;
			}
			return this;
		}
		return this;
	}

	navigateToLastNonEmptyChar(): StringParser {
		const nextString = this.nextString.trimRight();
		this._offset += nextString.length - 1;
		return this;
	}

	next(length?: number): StringParser {
		if (this._offset >= this._data.length) {
			return this;
		}
		const delta = length === undefined ? 1 : length;
		this._offset += delta;
		if (this._offset > this._data.length) {
			this._offset = this._data.length;
		}
		return this;
	}

	parseToken(exclude?: string[]): string {
		let res = '';
		this.navigateToFirstNonEmptyChar();
		while (true) {
			const currentChar = this.currentChar;
			if (currentChar === undefined) {
				return res;
			}
			if (StringUtils.charIsEmpty(currentChar) ||
				(exclude && exclude.indexOf(currentChar) >= 0)) {
				return res;
			}
			res += this.currentChar;
			this.next();
		}
	}

	navigateUntil(validator: StringValidator): StringNavigationInfos;
	navigateUntil(tokens: string[]): StringNavigationInfos;
	navigateUntil(token: string): StringNavigationInfos;
	navigateUntil(data: StringValidator | string | string[]): StringNavigationInfos {
		const firstOffset = this._offset;
		const content = this.nextString;
		while (true) {
			const currentChar = this.currentChar;
			if (currentChar === undefined) {
				return {
					text: content,
					range: {
						start: firstOffset,
						end: this._offset
					},
					stopPattern: ''
				};
			}
			const str = content.slice(0, this.offset + 1 - firstOffset);
			if (typeof data === 'string') {
				if (str.endsWith(data)) {
					this._offset++;
					return {
						text: content.slice(0, this._offset - firstOffset - data.length),
						range: {
							start: firstOffset,
							end: this._offset - data.length,
						},
						stopPattern: data
					};
				}
			} else if (Array.isArray(data)) {
				const endPattern = data.reduce((prev, next) => {
					if (str.endsWith(next)) {
						if (next.length > prev.length) {
							return next;
						}
					}
					return prev;
				}, '');
				if (endPattern) { // TODO duplicated code
					this._offset++;
					return {
						text: content.slice(0, this._offset - firstOffset - endPattern.length),
						range: {
							start: firstOffset,
							end: this._offset - endPattern.length
						},
						stopPattern: endPattern
					};
				}
			} else {
				const validatorPositionResult = data.isValid(str);
				if (validatorPositionResult) {
					this._offset++;
					return {
						text: content.slice(0, this._offset - firstOffset - validatorPositionResult.stopPattern.length),
						range: {
							start: firstOffset,
							end: this._offset - validatorPositionResult.stopPattern.length
						},
						stopPattern: validatorPositionResult.stopPattern
					};
				}
			}
			this.next();
		}
	}

	get currentChar(): string | undefined {
		if (this._offset >= this._data.length) {
			return undefined;
		}
		return this._data[this._offset];
	}

	get nextString(): string {
		return this._data.slice(this._offset);
	}

	get offset(): number {
		return this._offset;
	}

	get hasText(): boolean {
		return this._data.trim().length > 0;
	}
}

export class StringUtils {
	static charIsEmpty(char: string): boolean {
		return whiteSpaceCharacters.indexOf(char) >= 0;
	}
	static isAplphaNumeric(char: string): boolean {
		char = char[0];
		const res = char.match(/[a-zA-Z0-9_-]/);
		return res !== null && res.length > 0;
	}
	static isLetter(char: string): boolean {
		char = char[0];
		const res = char.match(/[a-zA-Z]/);
		return res !== null && res.length > 0;
	}
	static lastCharIsEscaped(str: string, escapeToken: string): boolean {
		if (str.length < 2) return false;
		const reversedString = str.split('').reverse().join('');
		let escaped = false;
		for (let i = 1; i < reversedString.length; i++) {
			const char = reversedString[i];
			if (char !== escapeToken) {
				return escaped;
			}
			escaped = !escaped;
		}
		return false;
	}
	static antiCapitalize(tag: string): string {
		return tag.charAt(0).toLowerCase() + tag.slice(1);
	}
	static capitalize(tag: string): string {
		return tag.charAt(0).toUpperCase() + tag.slice(1);
	}
}

export const whiteSpaceCharacters = [' ', '\t', '\n', '\r', String.fromCharCode(160)];

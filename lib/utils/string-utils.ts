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
}

export const whiteSpaceCharacters = [' ', '\t', '\n', '\r'];

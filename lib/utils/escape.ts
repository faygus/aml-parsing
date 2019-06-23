import { StringValidator } from "./string-validator";
import { StringUtils } from "./string-utils";

export function nonEscapedValidator(char: string, escapeToken: string): StringValidator {
	return {
		isValid(data: string) {
			if (data.length === 0) return null;
			const reversedString = data.split('').reverse().join('');
			if (reversedString[0] !== char) return null;
			if (!StringUtils.lastCharIsEscaped(data, escapeToken)) {
				return {
					stopPattern: char
				};
			}
			return null;
		}
	}
}

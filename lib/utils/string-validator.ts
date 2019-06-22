export interface StringValidator {
	isValid(data: string): StringValidatorResult | null;
}

export interface StringValidatorResult {
	stopPattern: string;
}

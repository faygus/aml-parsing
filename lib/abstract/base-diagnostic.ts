import { IDiagnostic } from "../interfaces/i-diagnostic";

export abstract class BaseDiagnostic<T> implements IDiagnostic<T> {
	constructor(public offset: number, public type: T) {

	}
}

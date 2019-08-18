import { VariableIdentifier } from "./tokens";

export class Interpretation {
	argument: string | number | boolean | VariableIdentifier;
	pipeIdentifier?: string;
}

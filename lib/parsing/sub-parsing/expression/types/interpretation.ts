import { VariableIdentifier } from "../../../../models/expressions";

export class Interpretation {
	argument: string | number | boolean | VariableIdentifier;
	pipeIdentifier?: string;
}

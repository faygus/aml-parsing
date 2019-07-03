import { Interpretation as ExpressionInterpretation } from "../sub-parsing/expression/types/interpretation";

export class AmlInterpretation {
	tag: string;
	attributes: IJsonAttributes = {};
	children: AmlInterpretation[] = [];
}

export type IJsonAttributes = { [key: string]: PropertyValue };
export type PropertyValue = string | number | boolean | ExpressionInterpretation | IJsonAttributes;

export { ExpressionInterpretation };

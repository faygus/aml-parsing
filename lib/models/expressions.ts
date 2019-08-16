import { Token, GroupOfTokens, TokenWithContext } from "code-parsing";

export class VariableArgumentToken extends Token {
}

export class LiteralArgumentToken extends Token {
}

export class PipeToken extends TokenWithContext<PipeCxt> {
}

// contexts

export class PipeCxt {
	constructor(public variable: string | VariableIdentifier) {
	}
}

// group of tokens inside an expression
export type Tokens = VariableArgumentToken | LiteralArgumentToken | PipeToken;

export class ExpressionTokensList extends GroupOfTokens<Tokens> {
}

export class VariableIdentifier {
	constructor(public name: string) {}
}

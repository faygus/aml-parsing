export class Range {
	constructor(public start: number, public end: number) {

	}

	add(offset: number): Range {
		return new Range(this.start + offset, this.end + offset);
	}
}

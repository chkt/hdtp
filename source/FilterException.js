export default class FilterException extends Error {
	constructor() {
		super('filter queue aborted');
	}
}

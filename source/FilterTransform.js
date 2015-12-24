import Queue from 'qee/dist/Queue';
import FilterAbort from './FilterException';



export default class FilterTransform extends Queue {
	process(data) {
		for (let trn of this) {
			try {
				data = trn(data);
			}
			catch (err) {
				if (err instanceof FilterAbort) return null;

				throw err;
			}

			if (data === null) return null;
		}

		return data;
	}
}

# hdtp

Heterogeneous Data Transform and Propagation

## Install

```sh
$ npm install hdtp
```

## Use

```js
import * as hdtp from 'hdtp';

let consumerA = new hdtp.Consumer(data => { ... });
consumerA.requestTransform.append(data => ({
	data
}));
consumerA.replyTransform.append(data => data['result'] === 'success' ? true : false);

let consumerB = new hdtp.Consumer.Configure(
	data => { ... },
	[data => ({
		foo : data.bar,
		bar : data.baz
	})],
	[
		data => typeof data === 'string' ? data : null,
		data => data.charAt(0)
	]
);

new hdtp.Distributor([consumerA, consumerB]).send({
	id : 1,
	name : 'test'
})
	.then(results => { ... });
```

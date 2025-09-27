import { TextDecoder, TextEncoder } from 'node:util';
import { JSDOMEnvironment } from 'vitest/environments';

export default class CustomJsdomEnvironment extends JSDOMEnvironment {
	async setup(globalOptions) {
		const result = await super.setup(globalOptions);
		const { global } = this;

		Object.defineProperty(global, 'TextEncoder', {
			value: TextEncoder,
			configurable: true,
			writable: true,
		});

		Object.defineProperty(global, 'TextDecoder', {
			value: TextDecoder,
			configurable: true,
			writable: true,
		});

		const originalEncode = TextEncoder.prototype.encode;
		TextEncoder.prototype.encode = function encodePatched(...args) {
			const resultBytes = originalEncode.apply(this, args);
			return resultBytes instanceof Uint8Array
				? resultBytes
				: new Uint8Array(resultBytes);
		};

		return result;
	}
}

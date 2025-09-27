export default async function globalSetup() {
	globalThis.__NODE_TEXT_ENCODER__ = globalThis.TextEncoder;
	globalThis.__NODE_TEXT_DECODER__ = globalThis.TextDecoder;
	globalThis.__NODE_UINT8_ARRAY__ = globalThis.Uint8Array;
}

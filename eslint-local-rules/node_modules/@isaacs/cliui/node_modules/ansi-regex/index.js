export default function ansiRegex({onlyFirst = false} = {}) {
	// Valid string terminator sequences are BEL, ESC\, and 0x9c
	const ST = '(?:\\u0007|\\u001B\\u005C|\\u009C)';

	// OSC sequences only: ESC ] ... ST (or the C1 introducer 0x9d ... ST)
	// The payload stops at the first terminator character rather than scanning ahead for one, so an unterminated `ESC ]` cannot rescan the rest of the input. Terminals likewise abort a control string on an unexpected ESC. The payload also stops at 0x9d so an unterminated C1 OSC cannot swallow the next one.
	const osc = `(?:(?:\\u001B\\]|\\u009D)[^\\u0007\\u001B\\u009C\\u009D]*${ST})`;

	// CSI and related: ESC/C1, optional intermediates, optional params (supports ; and :) then final byte
	const csi = '[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]';

	const pattern = `${osc}|${csi}`;

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

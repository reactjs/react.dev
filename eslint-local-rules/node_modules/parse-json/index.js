import errorEx from 'error-ex';
import fallback from 'json-parse-even-better-errors';
import {codeFrameColumns} from '@babel/code-frame';
import {LinesAndColumns} from 'lines-and-columns';

export const JSONError = errorEx('JSONError', {
	fileName: errorEx.append('in %s'),
	codeFrame: errorEx.append('\n\n%s\n'),
});

const generateCodeFrame = (string, location, highlightCode = true) =>
	codeFrameColumns(string, {start: location}, {highlightCode});

const getErrorLocation = (string, message) => {
	const match = message.match(/in JSON at position (?<index>\d+)(?: \(line (?<line>\d+) column (?<column>\d+)\))? while parsing/);

	if (!match) {
		return;
	}

	let {index, line, column} = match.groups;

	if (line && column) {
		return {line: Number(line), column: Number(column)};
	}

	({line, column} = new LinesAndColumns(string).locationForIndex(Number(index)));

	return {line: line + 1, column: column + 1};
};

export default function parseJson(string, reviver, filename) {
	if (typeof reviver === 'string') {
		filename = reviver;
		reviver = undefined;
	}

	let message;
	try {
		return JSON.parse(string, reviver);
	} catch (error) {
		message = error.message;
	}

	try {
		fallback(string, reviver);
	} catch (error) {
		message = error.message;
	}

	message = message.replace(/\n/g, '');
	const jsonError = new JSONError(message);

	if (filename) {
		jsonError.fileName = filename;
	}

	const location = getErrorLocation(string, message);
	if (location) {
		jsonError.codeFrame = generateCodeFrame(string, location);
		jsonError.rawCodeFrame = generateCodeFrame(string, location, /* highlightCode */ false);
	}

	throw jsonError;
}

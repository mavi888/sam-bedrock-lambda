const util = require('util');
const stream = require('stream');
const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);

const {
	BedrockRuntimeClient,
	InvokeModelWithResponseStreamCommand,
} = require('@aws-sdk/client-bedrock-runtime'); // ES Modules import

const client = new BedrockRuntimeClient();

exports.handler = awslambda.streamifyResponse(
	async (event, responseStream, _context) => {
		const PROMPT =
			'Can you write a story that is 20 paragraphs long about a cat in space. The story should be funny and have a begining, middle, and end. The story should be funny to a 10 year old.';

		const input = {
			modelId: 'cohere.command-text-v14',
			contentType: 'application/json',
			accept: '*/*',
			body: `{"prompt":"${PROMPT}","max_tokens":2149,"temperature":0.75,"p":0.01,"k":0,"stop_sequences":[],"return_likelihoods":"NONE"}`,
		};

		console.log(input);

		const command = new InvokeModelWithResponseStreamCommand(input);
		console.log('d');

		/*const requestStream = Readable.from(
			Buffer.from(new Array(1024 * 1024).join('🚣'))
		);*/

		//		let eventStream = data.body;
		//	console.log(eventStream);
		try {
			data = await client.send(command);
			console.log('a');
			const requestStream = Readable.from(data.body);
			console.log('b');
			await pipeline(requestStream, responseStream);
		} catch (error) {
			console.log('c');
			console.log(error);
		}
	}
);

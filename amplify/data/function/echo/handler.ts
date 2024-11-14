import type { Handler } from 'aws-lambda';

interface EchoEvent {
	arguments: {
		content: string;
	};
}

export const handler: Handler<EchoEvent, { content: string; executionDuration: number }> = async (event) => {
	const { content } = event.arguments;
	const executionStart = Date.now();

	// Mock some processing delay
	await new Promise((resolve) => setTimeout(resolve, 100));

	const executionDuration = (Date.now() - executionStart) / 1000;
	return {
		content,
		executionDuration
	};
};
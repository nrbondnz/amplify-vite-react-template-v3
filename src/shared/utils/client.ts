// @shared/utils/client.ts
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "./../../../amplify/data/resource";
import outputs from "../../../amplify_outputs.json";

Amplify.configure(outputs);

 const client = generateClient<Schema>();

const clientModels = client.models;

type ModelNames = keyof typeof clientModels;

export const modelNamesArray: ModelNames[] = Object.keys(clientModels) as ModelNames[];

const ClientModelMap: { [key in ModelNames]: string } = modelNamesArray.reduce((acc, name) => {
	acc[name] = name;
	return acc;
}, {} as { [key in ModelNames]: string });

console.log(ClientModelMap);

// Generating entityToModelMap dynamically
const generateEntityToModelMap = (modelNames: ModelNames[]): Record<string, ModelNames> => {
	const map: Record<string, ModelNames> = {};
	modelNames.forEach(modelName => {
		// Assuming entity names can be derived directly from model names, adjust as necessary
		map[modelName] = modelName;
	});
	return map;
};

const entityToModelMap: Record<string, ModelNames> = generateEntityToModelMap(modelNamesArray);

console.log(entityToModelMap);

// Function to get model name by entity name
export const getModelNameByEntity = (entityName: string): ModelNames | undefined => {
	return entityToModelMap[entityName];
};



export { client };
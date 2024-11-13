// utils/removeFields.ts
export function removeFields<T, K extends keyof T>(obj: T, fields: K[]): Omit<T, K> {
	const newObj = { ...obj };
	fields.forEach(field => delete newObj[field]);
	return newObj;
}
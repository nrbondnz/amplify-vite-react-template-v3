// utils/getNextId.ts
export const getNextId = <T extends { id: number }>(items: T[]): number => {
	return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};
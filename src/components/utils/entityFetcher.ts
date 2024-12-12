// entityFetcher.ts

import { useDataContext } from "@context/DataContext";
import { EntityTypes } from "@shared/types/types";

export const useEntities = (entityType: EntityTypes) => {
	const dataContext = useDataContext();
	const entities  = dataContext.getManagerByType(entityType);
	return entities;
};
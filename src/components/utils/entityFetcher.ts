// entityFetcher.ts

import { useEntityData } from "@hooks/useEntityData";
import { EntityTypes } from "@shared/types/types";

export const useEntities = (entityType: EntityTypes) => {
	const { entities } = useEntityData(entityType);
	return entities;
};
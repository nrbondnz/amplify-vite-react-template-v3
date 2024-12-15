import React from "react";
import { useDataContext } from "@context/DataContext";
import { EntityTypes } from "@shared/types/types";

/**
 * Higher-Order Component (HOC) to pass the entity manager for a specified entity type to a child component.
 *
 * @param entityType The type of entities being managed (e.g., "Exercise").
 */
const withEntityData = <T extends { id: string | number }>(
	entityType: EntityTypes
) => (
	Component: React.ComponentType<{
		entityManager: {
			entities: T[];
			getEntityById: (id: string) => T | null;
			getNextId: () => number;
			refreshEntities: () => void;
			loading: boolean;
			error: string | null;
		};
	}>
) => {
	return (props: any) => {
		// Retrieve entity manager using the DataContext
		const manager = useDataContext().getManagerByType(entityType);

		if (!manager) {
			throw new Error(`Entity manager for type ${entityType} is undefined.`);
		}

		/**
		 * Generate the next available ID for a new entity.
		 * This assumes that all entities have numeric or string-based IDs that can be parsed into numbers.
		 */
		const getNextId = (): number => {
			if (manager.entities.length === 0) return 1; // Handle if there are no existing entities
			return (
				Math.max(
					...manager.entities.map((entity) =>
						typeof entity.id === "string" ? parseInt(entity.id, 10) : entity.id
					)
				) + 1
			);
		};

		// Return the wrapped component with the entity manager as a prop
		return (
			<Component
				{...props}
				entityManager={{
					entities: manager.entities,
					getEntityById: manager.getEntityById,
					getNextId, // Inject the getNextId function
					refreshEntities: manager.refreshEntities,
					loading: manager.loading,
					error: manager.error,
				}}
			/>
		);
	};
};

export default withEntityData;
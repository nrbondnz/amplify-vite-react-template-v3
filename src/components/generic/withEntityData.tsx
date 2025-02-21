import React from "react";
import { useDataContext } from "@context/DataContext";
import { EntityTypes } from "@shared/types/types";

const withEntityData =
	<T extends { id: string | number }>(entityType: EntityTypes) =>
		(Component: React.ComponentType<{
			entityManager: {
				entities: T[];
				getEntityById: (id: string) => T | null;
				setEntities: (entities: T[]) => void;
				getNextId: () => number;
				refreshEntities: () => void;
				loading: boolean;
				error: string | null;

			};
		}>) =>
			(props: any) => {
				// Retrieve entity manager using the DataContext
				const dataContext = useDataContext();
				const manager = dataContext.getManagerByType(entityType);

				if (!manager) {
					throw new Error(`Entity manager for type ${entityType} is undefined.`);
				}

				/**
				 * Generate the next available ID for a new entity.
				 */
				const getNextId = (): number => {
					if (manager.entities.length === 0) return 1; // Handle if there are no existing entities
					return Math.max(
						...manager.entities.map((entity) =>
							typeof entity.id === "string" ? parseInt(entity.id, 10) : entity.id
						)
					) + 1;
				};

				// Return the wrapped component
				return (
					<Component
						{...props}
						entityManager={{
							...manager,
							getNextId,
						}}
					/>
				);
			};

export default withEntityData;
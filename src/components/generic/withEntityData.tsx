import { useDataContext } from "@context/DataContext";
import React from 'react';
import { EntityTypes, WithId } from '@shared/types/types';

interface WithEntityDataProps<T extends WithId> {
	entities: T[];
	getEntityById: (id: string) => T | null;
	getNextId: () => number;
	loading: boolean;
	error: string | null;
}

const withEntityData = <T extends WithId,>(entityType: EntityTypes) => (
	Component: React.ComponentType<WithEntityDataProps<T>>
) => {
	return (props: Omit<WithEntityDataProps<T>, keyof WithEntityDataProps<T>>) => {
		// Get the manager dynamically
		const manager = useDataContext().getManagerByType(entityType);

		// Check and cast manager to the correct inferred type
		if (!manager) {
			throw new Error(`Manager for entity type ${entityType} not found.`);
		}

		const typedManager = manager as unknown as WithEntityDataProps<T>

		return (
			<Component
				{...props}
				entities={typedManager.entities}
				getEntityById={typedManager.getEntityById}
				getNextId={typedManager.getNextId}
				loading={typedManager.loading}
				error={typedManager.error}
			/>
		);
	};
};

export default withEntityData;
import React from 'react';
import { useEntityData } from '@hooks/useEntityData';
import { EntityTypes, WithId } from '@shared/types/types';
//import { WithId } from '@hooks/useEntityData';

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
	return (props: Omit<WithEntityDataProps<T>, 'entities' | 'getEntityById' | 'getNextId' | 'loading' | 'error'>) => {
		const { entities, error, getEntityById, getNextId, loading } = useEntityData<T>(entityType);

		return (
			<Component
				{...props}
				entities={entities}
				getEntityById={getEntityById}
				getNextId={getNextId}
				loading={loading}
				error={error}
			/>
		);
	};
};

export default withEntityData;
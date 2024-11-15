import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { client } from '@shared/utils/client';
import {
	IExercise,
	IEntityRelationship,
	EntityTypes,
	getEntityDefault
} from '@shared/types/types';

// Utility functions to get key field and partner field based on entity type
const getKeyField = (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return 'muscleId';
		case EntityTypes.Exercise:
			return 'exerciseId';
		// Add cases for other EntityTypes as needed
		default:
			return '';
	}
};

const getPartnerField = (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return 'partnerMuscleId';
		case EntityTypes.Exercise:
			return 'partnerExerciseId';
		// Add cases for other EntityTypes as needed
		default:
			return '';
	}
};

const getPartnerModels = async (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return await client.models.muscles.list();
		case EntityTypes.Exercise:
			return await client.models.exercises.list();
		// Add cases for other EntityTypes as needed
		default:
			throw new Error(`Unsupported entity type: ${type}`);
	}
};

interface ManageRelationshipsProps {
	keyId: number;
	keyType: EntityTypes;
	partnerType: EntityTypes;
}

const ManageRelationships: React.ForwardRefRenderFunction<unknown, ManageRelationshipsProps> = ({ keyId, keyType, partnerType }, ref) => {
	const [mappings, setMappings] = useState<(IExercise & { relationshipId: number })[]>([]);
	const [availablePartners, setAvailablePartners] = useState<IExercise[]>([]);
	const [cancelledChanges, setCancelledChanges] = useState<IEntityRelationship[]>([]);

	useEffect(() => {
		const fetchMappings = async () => {
			try {
				const response = await client.models.entity_relationships.list();
				const relationships = response.data as IEntityRelationship[];

				const keyField = getKeyField(keyType);
				const partnerField = getPartnerField(partnerType);

				if (!keyField || !partnerField) return;

				const partnerMappings = relationships.filter(
					rel => rel[keyField as keyof IEntityRelationship] === keyId
				);

				const partnersResponse = await getPartnerModels(partnerType);
				const partners = partnersResponse.data as IExercise[];

				const mappedPartners = partnerMappings.map(rel => {
					const partner = partners.find(part => part.id === rel[partnerField as keyof IEntityRelationship]);
					return partner ? { ...partner, relationshipId: rel.id } : undefined;
				}).filter(Boolean);

				setMappings(mappedPartners as (IExercise & { relationshipId: number })[]);
			} catch (error) {
				console.error(`Failed to fetch ${keyType.toLowerCase()} mappings:`, error);
			}
		};

		const fetchAvailablePartners = async () => {
			try {
				const partnersResponse = await getPartnerModels(partnerType);
				setAvailablePartners(partnersResponse.data as IExercise[]);
			} catch (error) {
				console.error(`Failed to fetch ${partnerType.toLowerCase()}s:`, error);
			}
		};

		fetchMappings();
		fetchAvailablePartners();

		return () => {
			if (cancelledChanges.length > 0) {
				rollbackChanges();
			}
		};
	}, [keyId, keyType, partnerType]);

	const rollbackChanges = async () => {
		try {
			for (const change of cancelledChanges) {
				if (change.id) {
					await client.models.entity_relationships.delete({ id: change.id });
				} else {
					await client.models.entity_relationships.create(change);
				}
			}
			setCancelledChanges([]);
		} catch (error) {
			console.error('Failed to rollback changes:', error);
		}
	};

	const handleAddPartner = async (partnerId: number) => {
		try {
			const keyField = getKeyField(keyType);
			const partnerField = getPartnerField(partnerType);

			if (!keyField || !partnerField) return;

			const newRelationship: IEntityRelationship = {
				...getEntityDefault(EntityTypes.EntityRelationship),
				[keyField]: keyId,
				[partnerField]: partnerId,
				id: Date.now() // Temporary ID for local state management
			} as IEntityRelationship; // Use type assertion here

			await client.models.entity_relationships.create(newRelationship);

			const newMapping = availablePartners.find(part => part.id === partnerId);
			if (newMapping) {
				setMappings([...mappings, { ...newMapping, relationshipId: Date.now() }]); // Temporary ID for local state
				setCancelledChanges([...cancelledChanges, newRelationship]);
			}
		} catch (error) {
			console.error(`Failed to add ${partnerType.toLowerCase()} to ${keyType.toLowerCase()}:`, error);
		}
	};

	const handleRemovePartner = async (partnerId: number) => {
		try {
			const relationship = mappings.find(part => part.id === partnerId);
			if (relationship) {
				await client.models.entity_relationships.delete({ id: relationship.relationshipId });
				setMappings(mappings.filter(part => part.id !== partnerId));
				setCancelledChanges(cancelledChanges.filter(rel => rel.id !== partnerId));
			}
		} catch (error) {
			console.error(`Failed to remove ${partnerType.toLowerCase()} from ${keyType.toLowerCase()}:`, error);
		}
	};

	useImperativeHandle(ref, () => ({
		saveRelationships: () => {
			// custom save logic
		},
		cancelRelationships: rollbackChanges
	}));

	return (
		<div>
			<h2>Manage {keyType} to {partnerType} Mappings</h2>
			<div>
				<h3>Current Mappings</h3>
				<ul>
					{mappings.map((partner) => (
						<li key={partner.id}>
							{partner.entityName}
							<button onClick={() => handleRemovePartner(partner.id)}>Remove</button>
						</li>
					))}
				</ul>
			</div>

			<div>
				<h3>Add New Mapping</h3>
				<select onChange={(e) => handleAddPartner(Number(e.target.value))} defaultValue="">
					<option value="" disabled>Select {partnerType}</option>
					{availablePartners.map((partner) => (
						<option key={partner.id} value={partner.id}>
							{partner.entityName}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default forwardRef(ManageRelationships);
import { useEntityData } from "@hooks/useEntityData";
import {
	EntityTypes,
	getEntityDefault,
	IEntityRelationship,
	IExercise
} from '@shared/types/types';
import { client } from '@shared/utils/client';
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState
} from 'react';

// Utility functions to get key field and partner field based on entity type
const getKeyField = (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return 'muscleId';
		case EntityTypes.Exercise:
			return 'exerciseId';
		// Add cases for other EntityTypes as needed
		case EntityTypes.Machine:
			return 'machineId';
		default:
			return '';
	}
};

const getPartnerField = (type: EntityTypes) => {
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
	const { getNextId } = useEntityData(EntityTypes.EntityRelationship);

	useEffect(() => {
		const fetchMappings = async () => {
			try {
				const response = await client.models.entity_relationships.list();
				const relationships = response.data as IEntityRelationship[];
				console.log("Fetched relationships: ", relationships);

				const keyField = getKeyField(keyType);
				const partnerField = getPartnerField(partnerType);

				if (!keyField || !partnerField) {
					console.warn("Invalid key or partner field");
					return;
				}

				const partnerMappings = relationships.filter(
					rel => rel[keyField as keyof IEntityRelationship] === keyId
				);
				console.log("Mappings for keyId:", keyId, partnerMappings);

				const partnersResponse = await getPartnerModels(partnerType);
				const partners = partnersResponse.data as IExercise[];
				console.log("Fetched available partners: ", partners);

				const mappedPartners = partnerMappings.map(rel => {
					const partner = partners.find(part => part.id === rel[partnerField as keyof IEntityRelationship]);
					return partner ? { ...partner, relationshipId: rel.id } : undefined;
				}).filter(Boolean);

				setMappings(mappedPartners as (IExercise & { relationshipId: number })[]);
				console.log("Set mappings state: ", mappedPartners);
			} catch (error) {
				console.error(`Failed to fetch ${keyType.toLowerCase()} mappings:`, error);
			}
		};

		const fetchAvailablePartners = async () => {
			try {
				const partnersResponse = await getPartnerModels(partnerType);
				setAvailablePartners(partnersResponse.data as IExercise[]);
				console.log("Set available partners state: ", partnersResponse.data);
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
	}, [keyId, keyType, partnerType, cancelledChanges]);

	const rollbackChanges = async () => {
		try {
			for (const change of cancelledChanges) {
				if (change.id) {
					console.log("Rollback delete relationship: ", change);
					await client.models.entity_relationships.delete({ id: change.id });
				} else {
					console.log("Rollback create relationship: ", change);
					await client.models.entity_relationships.create(change);
				}
			}
			setCancelledChanges([]);
			console.log("Cancelled changes reset");
		} catch (error) {
			console.error('Failed to rollback changes:', error);
		}
	};

	const handleAddPartner = async (partnerId: number) => {
		try {
			const keyField = getKeyField(keyType);
			const partnerField = getPartnerField(partnerType);

			if (!keyField || !partnerField) {
				console.warn("Invalid key or partner field");
				return;
			}

			// Create the relationship object for local state management
			const newRelationship: IEntityRelationship = {
				...getEntityDefault(EntityTypes.EntityRelationship),
				[keyField]: keyId,
				[partnerField]: partnerId,
				id: getNextId() // Temporary ID for local state management
			};
			console.log("Created new relationship: ", JSON.parse(JSON.stringify(newRelationship)));

			// Create the input object for the API call
			//const { id, ...inputForApi } = newRelationship;

			console.log("Creating new relationship with payload:", newRelationship);

			const response = await client.models.entity_relationships.create(newRelationship);
			console.log("API response from create:", response);

			if (!response.data) {
				console.error("Failed to create new relationship", response);
				if (response.errors) {
					console.error("API error details:", response.errors);
				}
				return;
			}
			console.log("Created new relationship: ", response.data);

			const newMapping = availablePartners.find(part => part.id === partnerId);
			if (newMapping) {
				setMappings([...mappings, { ...newMapping, relationshipId: response.data.id || Date.now() }]);
				setCancelledChanges([...cancelledChanges, { ...newRelationship, id: response.data.id }]);
				console.log("Updated mappings and cancelled changes state");
			}
		} catch (error) {
			console.error(`Failed to add ${partnerType.toLowerCase()} to ${keyType.toLowerCase()}:`, error);
		}
	};

	const handleRemovePartner = async (partnerId: number) => {
		try {
			const relationship = mappings.find(part => part.id === partnerId);
			if (relationship) {
				console.log("Deleting relationship: ", relationship);
				const response = await client.models.entity_relationships.delete({ id: relationship.relationshipId });
				console.log("Deleted relationship response: ", response);

				setMappings(mappings.filter(part => part.id !== partnerId));
				setCancelledChanges(cancelledChanges.filter(rel => rel.id !== partnerId));
				console.log("Updated mappings and cancelled changes state after deletion");
			}
		} catch (error) {
			console.error(`Failed to remove ${partnerType.toLowerCase()} from ${keyType.toLowerCase()}:`, error);
		}
	};

	useImperativeHandle(ref, () => ({
		saveRelationships: () => {
			// custom save logic
			console.log("Relationships saved");
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
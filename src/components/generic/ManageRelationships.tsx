import { useEntityData } from "@hooks/useEntityData";
import {
	EntityTypes,
	getEntityDefault,
	IEntityRelationship,
	IExercise,
} from "@shared/types/types";
import { client } from "@shared/utils/client";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
	ForwardedRef,
} from "react";

// Utility functions to get key field and partner field based on entity type
const getKeyField = (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return "muscleId";
		case EntityTypes.Exercise:
			return "exerciseId";
		// Add cases for other EntityTypes as needed
		case EntityTypes.Machine:
			return "machineId";
		default:
			return "";
	}
};

const getPartnerField = (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return "muscleId";
		case EntityTypes.Exercise:
			return "exerciseId";
		// Add cases for other EntityTypes as needed
		case EntityTypes.Machine:
			return "machineId";
		default:
			return "";
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

// Define the methods that will be exposed to the ref
interface ManageRelationshipsHandle {
	saveRelationships: () => void;
	cancelRelationships: () => void;
}

// Types for new and delete operations
interface NewRelationship extends IEntityRelationship {
	type: "new";
}
interface DeleteRelationship {
	type: "delete";
	relationshipId: number;
	id: number; // Added to ensure compatibility
}
type ExtendedRelationship = NewRelationship | DeleteRelationship;

const ManageRelationships: React.ForwardRefRenderFunction<
	ManageRelationshipsHandle,
	ManageRelationshipsProps
> = ({ keyId, keyType, partnerType }, ref: ForwardedRef<ManageRelationshipsHandle>) => {
	const [mappings, setMappings] = useState<(IExercise & { relationshipId: number })[]>([]);
	const [availablePartners, setAvailablePartners] = useState<IExercise[]>([]);
	const [currentChanges, setCurrentChanges] = useState<ExtendedRelationship[]>([]);
	const { getNextId } = useEntityData(EntityTypes.EntityRelationship);

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
				(rel) => rel[keyField as keyof IEntityRelationship] === keyId
			);
			console.log("Mappings for keyId:", keyId, partnerMappings);

			const partnersResponse = await getPartnerModels(partnerType);
			const partners = partnersResponse.data as IExercise[];
			console.log("Fetched available partners: ", partners);

			const mappedPartners = partnerMappings
				.map((rel) => {
					const partner = partners.find(
						(part) => part.id === rel[partnerField as keyof IEntityRelationship]
					);
					return partner ? { ...partner, relationshipId: rel.id } : undefined;
				})
				.filter((partner): partner is IExercise & { relationshipId: number } => partner !== undefined);

			setMappings(mappedPartners);
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

	useEffect(() => {
		fetchMappings();
		fetchAvailablePartners();
	}, [keyId, keyType, partnerType]);

	const rollbackChanges = async () => {
		await fetchMappings();
		setCurrentChanges([]);
		console.log("Rolled back changes");
	};

	const handleAddPartner = (partnerId: number) => {
		const keyField = getKeyField(keyType);
		const partnerField = getPartnerField(partnerType);

		if (!keyField || !partnerField) {
			console.warn("Invalid key or partner field");
			return;
		}

		const existingRelationship = mappings.find((partner) => partner.id === partnerId);
		if (existingRelationship) {
			console.warn(`Relationship already exists between ${keyType} and ${partnerType}`);
			return;
		}

		const newRelationship: NewRelationship = {
			...getEntityDefault(EntityTypes.EntityRelationship),
			[keyField]: keyId,
			[partnerField]: partnerId,
			id: getNextId(),
			type: "new",
		};

		const newMapping = availablePartners.find((part) => part.id === partnerId);
		if (newMapping) {
			setMappings([...mappings, { ...newMapping, relationshipId: newRelationship.id }]);
			setCurrentChanges([...currentChanges, newRelationship]);
		}
	};

	const handleRemovePartner = (partnerId: number) => {
		const relationship = mappings.find((part) => part.id === partnerId);
		if (relationship) {
			const newDeleteRelationship: DeleteRelationship = { relationshipId: relationship.relationshipId, id: getNextId(), type: "delete" };
			setMappings(mappings.filter((part) => part.id !== partnerId));
			setCurrentChanges([...currentChanges, newDeleteRelationship]);
		}
	};

	const saveRelationships = async () => {
		for (const change of currentChanges) {
			const { type, ...relationshipData } = change;

			if (type === "new") {
				console.log("Saving new relationship: ", relationshipData);
				await client.models.entity_relationships.create(relationshipData);
			} else if (type === "delete") {
				console.log("Deleting relationship: ", change);
				await client.models.entity_relationships.delete({ id: change.relationshipId });
			}
		}
		setCurrentChanges([]);
		console.log("Relationships saved and current changes reset");
	};

	useImperativeHandle(ref, () => ({
		saveRelationships,
		cancelRelationships: rollbackChanges,
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

export default forwardRef<ManageRelationshipsHandle, ManageRelationshipsProps>(ManageRelationships);
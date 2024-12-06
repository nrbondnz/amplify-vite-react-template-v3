import { useEntityData } from "@hooks/useEntityData";
import {
	EntityTypes,
	getEntityDefault,
	IEntityRelationship,
	IExercise,
} from "@shared/types/types";
import { client } from "@shared/utils/client";
import React, {
	ForwardedRef,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";

// Utility functions to get key field and partner field based on entity type
const getKeyField = (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return "muscleId";
		case EntityTypes.Exercise:
			return "exerciseId";
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
		default:
			throw new Error(`Unsupported entity type: ${type}`);
	}
};

interface ManageRelationshipsProps {
	keyId: number;
	keyType: EntityTypes;
	partnerType: EntityTypes;
}

interface ManageRelationshipsHandle {
	saveRelationships: () => void;
	cancelRelationships: () => void;
}

interface NewRelationship extends IEntityRelationship {
	type: "new";
}

interface DeleteRelationship {
	type: "delete";
	relationshipId: number;
	id: number;
}

type ExtendedRelationship = NewRelationship | DeleteRelationship;

const removeDuplicates = <T extends { id: number }>(items: T[]): T[] => {
	const uniqueIds = new Set<number>();
	return items.filter(item => {
		const isNew = !uniqueIds.has(item.id);
		uniqueIds.add(item.id);
		return isNew;
	});
};

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
			const response = await client.models.entityRelationships.list();
			const relationships = response.data as IEntityRelationship[];
			const keyField = getKeyField(keyType);
			const partnerField = getPartnerField(partnerType);

			if (!keyField || !partnerField) {
				console.warn("Invalid key or partner field");
				return;
			}

			const partnerMappings = relationships.filter(
				(rel) => rel[keyField as keyof IEntityRelationship] === keyId
			);

			const partnersResponse = await getPartnerModels(partnerType);
			let partners: IExercise[] = partnersResponse.data.map((partner: any) => ({
				id: partner.id,
				entityName: partner.entityName,
				description: partner.description || "",
				idMachine: partner.idMachine || null,
				displayNum: partner.displayNum || null,
				idUser: partner.idUser || null,
				fame: partner.fame || null,
			}));

			partners = removeDuplicates(partners);

			const mappedPartners = partnerMappings
				.map((rel) => {
					const partner = partners.find(
						(part) => part.id === rel[partnerField as keyof IEntityRelationship]
					);
					return partner ? { ...partner, relationshipId: rel.id } : undefined;
				})
				.filter((partner): partner is IExercise & { relationshipId: number } => partner !== undefined);

			setMappings(removeDuplicates(mappedPartners));
		} catch (error) {
			console.error(`Failed to fetch ${keyType.toLowerCase()} mappings:`, error);
		}
	};

	const fetchAvailablePartners = async () => {
		try {
			const partnersResponse = await getPartnerModels(partnerType);
			const partners: IExercise[] = partnersResponse.data.map((partner: any) => ({
				id: partner.id,
				entityName: partner.entityName,
				description: partner.description || "",
				idMachine: partner.idMachine || null,
				displayNum: partner.displayNum || null,
				idUser: partner.idUser || null,
				fame: partner.fame || null,
			}));
			setAvailablePartners(removeDuplicates(partners));
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
			...getEntityDefault<IEntityRelationship>(EntityTypes.EntityRelationship).defaultEntity,
			[keyField]: keyId,
			[partnerField]: partnerId,
			id: getNextId(),
			type: "new",
		};

		const newMapping = availablePartners.find((part) => part.id === partnerId);
		if (newMapping) {
			setMappings(removeDuplicates([...mappings, { ...newMapping, relationshipId: newRelationship.id }]));
			setCurrentChanges([...currentChanges, newRelationship]);
		}
	};

	const handleRemovePartner = (partnerId: number) => {
		const relationship = mappings.find((part) => part.id === partnerId);
		if (relationship) {
			const newDeleteRelationship: DeleteRelationship = {
				relationshipId: relationship.relationshipId,
				id: getNextId(),
				type: "delete"
			};
			setMappings(mappings.filter((part) => part.id !== partnerId));
			setCurrentChanges([...currentChanges, newDeleteRelationship]);
		}
	};

	const saveRelationships = async () => {
		for (const change of currentChanges) {
			const { type, ...relationshipData } = change;

			if (type === "new") {
				await client.models.entityRelationships.create(relationshipData);
			} else if (type === "delete") {
				await client.models.entityRelationships.delete({ id: change.relationshipId });
			}
		}
		setCurrentChanges([]);
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
						<li key={`${partner.id}-${partner.relationshipId}`}> {/* Unique Key */}
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
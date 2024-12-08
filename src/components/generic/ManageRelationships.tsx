import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useEntityData } from "@hooks/useEntityData";
import { EntityTypes, getEntityDefault, IEntityRelationship } from "@shared/types/types";
import { client } from "@shared/utils/client";

// Utility function to get key field and partner field based on entity type
const getField = (type: EntityTypes): string => {
	switch (type) {
		case EntityTypes.Muscle:
			return "muscleId";    // Ensure this matches what your relationship model expects
		case EntityTypes.Exercise:
			return "exerciseId";  // Ensure this matches what your relationship model expects
		case EntityTypes.Machine:
			return "machineId";   // Ensure this matches what your relationship model expects
		default:
			return "";
	}
};

const getPartnerModels = async (type: EntityTypes) => {
	switch (type) {
		case EntityTypes.Muscle:
			return client.models.muscles.list();
		case EntityTypes.Exercise:
			return client.models.exercises.list();
		case EntityTypes.Machine:
			return client.models.machines.list();
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
	const [partnerEntities, setPartnerEntities] = useState<any[]>([]);
	const [unmappedPartners, setUnmappedPartners] = useState<any[]>([]);
	const [currentChanges, setCurrentChanges] = useState<any[]>([]);
	const { getNextId } = useEntityData(EntityTypes.EntityRelationship);

	const fetchMappings = async () => {
		try {
			console.log(`Fetching mappings for keyId: ${keyId}, keyType: ${keyType}, partnerType: ${partnerType}`);
			const relationshipsResponse = await client.models.entityRelationships.list();
			const relationships = relationshipsResponse.data as IEntityRelationship[];
			const keyField = getField(keyType);
			const partnerField = getField(partnerType);

			console.log(`Key field: ${keyField}, Partner field: ${partnerField}`);

			if (!keyField || !partnerField) {
				console.warn('Invalid key or partner field derived');
				return;
			}

			const partnersResponse = await getPartnerModels(partnerType);
			const partners = partnersResponse.data;

			// Generate mapped partners based on relationships
			const initialMappedPartners = partners.map((partner: any) => {
				const matchingRelationship = relationships.find(rel =>
					rel[keyField as keyof IEntityRelationship] === keyId &&
					rel[partnerField as keyof IEntityRelationship] === partner.id
				);

				if (matchingRelationship) {
					return {
						...partner,
						relationshipId: matchingRelationship.id,
					};
				}
				return null;
			}).filter(partner => partner !== null);

			// Incorporate currentChanges into the mappedPartners
			const newChangesMapped = currentChanges
				.filter(change => change.type === 'new')
				.map(change => {
					const partner = partners.find(part => part.id === change[partnerField]);
					if (partner) {
						return {
							...partner,
							relationshipId: change.id,
						};
					}
					return null;
				})
				.filter(part => part !== null);

			const combinedMappedPartners = removeDuplicates([...initialMappedPartners, ...newChangesMapped]);

			console.log('Mapped Partners (including current changes):', combinedMappedPartners);
			setPartnerEntities(combinedMappedPartners);
		} catch (error) {
			console.error(`Failed to fetch ${keyType.toLowerCase()} mappings:`, error);
		}
	};

	const fetchAvailablePartners = async () => {
		try {
			const partnersResponse = await getPartnerModels(partnerType);
			const partners = partnersResponse.data.map((partner: any) => ({
				id: partner.id,
				entityName: partner.entityName,
				displayNum: partner.displayNum || null,
			}));
			setUnmappedPartners(partners);
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
		const keyField = getField(keyType);
		const partnerField = getField(partnerType);

		if (!keyField || !partnerField) return;

		if (currentChanges.some(change => change[partnerField] === partnerId)) {
			console.warn(`Relationship already exists between ${keyType} and ${partnerType}`);
			return;
		}

		const newRelationship = {
			...getEntityDefault<IEntityRelationship>(EntityTypes.EntityRelationship).defaultEntity,
			[keyField]: keyId,
			[partnerField]: partnerId,
			type: "new",
		};

		const newMapping = unmappedPartners.find(part => part.id === partnerId);
		if (newMapping) {
			setPartnerEntities(removeDuplicates([...partnerEntities, { ...newMapping, relationshipId: newRelationship.id }]));
			setCurrentChanges([...currentChanges, newRelationship]);
		}
	};

	const handleRemovePartner = (partnerId: number) => {
		const relationship = partnerEntities.find(part => part.id === partnerId);
		if (relationship) {
			const deleteRelationship = {
				relationshipId: relationship.relationshipId,
				id: getNextId(),
				type: "delete"
			};
			setPartnerEntities(partnerEntities.filter(part => part.id !== partnerId));
			setCurrentChanges([...currentChanges, deleteRelationship]);
		}
	};

	const saveRelationships = async () => {
		console.log('Entering saveRelationships');
		if (currentChanges.length === 0) {
			console.log('No current changes to save.');
			return;
		}

		for (const change of currentChanges) {
			console.log('Processing change:', change);

			if (change.type === "new") {
				try {
					console.log('Attempting to create relationship:', change);

					const result = await new Promise((resolve, reject) => {
						const { type, ...relationshipData } = change;
						relationshipData.id = getNextId();
						console.log('Relationship data:', relationshipData);
						//relationshipData.machineId = 4;
						client.models.entityRelationships.create(relationshipData)
							.then(response => {
								console.log('Successfully created relationship:', response);
								resolve(response);
							})
							.catch(error => {
								console.error('Failed to create relationship:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
								reject(error);
							});
					});

					// Log result if needed
					console.log('Result from Promise:', result);
				} catch (error) {
					// Log the entire error object for better insight
					console.error('Promise rejection:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
				}
			} else if (change.type === "delete") {
				try {
					console.log('Attempting to delete relationship with id:', change.relationshipId);
					await client.models.entityRelationships.delete({ id: change.relationshipId });
					console.log('Successfully deleted relationship with id:', change.relationshipId);
				} catch (error) {
					console.error('Failed to delete relationship:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
				}
			}
		}

		console.log('Clearing current changes and fetching mappings...');
		setCurrentChanges([]);
		await fetchMappings();
		console.log('Completed saveRelationships');
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
					{partnerEntities.map((partner) => (
						<li key={`${partner.id}-${partner.relationshipId}`}>
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
					{unmappedPartners.map((partner) => (
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
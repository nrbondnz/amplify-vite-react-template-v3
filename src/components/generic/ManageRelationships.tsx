
import { useDataContext } from "@context/DataContext";
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
	EntityTypes,
	getEntityDefault, getFieldValue,
	IEntityRelationship
} from "@shared/types/types";
import { client } from "@shared/utils/client";

// Helper function to determine key and partner fields
const getField = (type: EntityTypes): keyof IEntityRelationship => {
	switch (type) {
		case EntityTypes.Muscle:
			return "muscleId";
		case EntityTypes.Exercise:
			return "exerciseId";
		case EntityTypes.Machine:
			return "machineId";
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

const removeDuplicates = (items: any[]): any[] => {
	const seenIds = new Set<number>();
	return items.filter(item => {
		if (seenIds.has(item.id)) {
			return false;
		}
		seenIds.add(item.id);
		return true;
	});
};

const ManageRelationships: React.ForwardRefRenderFunction<
	ManageRelationshipsHandle,
	ManageRelationshipsProps
> = ({ keyId, keyType, partnerType }, ref: ForwardedRef<ManageRelationshipsHandle>) => {
	const [partnerEntities, setPartnerEntities] = useState<any[]>([]);
	const [unmappedPartners, setUnmappedPartners] = useState<any[]>([]);
	const [currentChanges, setCurrentChanges] = useState<any[]>([]);
	const [selectedPartnerId, setSelectedPartnerId] = useState<number | "">("");
	const dataContext = useDataContext();
	const entityRelationData = dataContext.eRM
	const partnerEntityData = dataContext.getManagerByType(partnerType)

	const setupPartnerEntities = async () => {
		try {
			const keyField = getField(keyType);
			const partnerField = getField(partnerType);

			// Exclude entities with an ID of -1
			const connectedPartners = entityRelationData.filterByField(keyField as keyof IEntityRelationship, keyId).filter(rel => rel[partnerField] !== -1);
			const partnersData = partnerEntityData!.entities;

			const initialMappedPartners = connectedPartners
				.map(rel => {
					const partner = partnersData.find(part => part.id === rel[partnerField]);
					return partner ? { ...partner, relationshipId: rel.id } : null;
				})
				.filter(partner => partner !== null);

			const newChangesMapped = currentChanges
				.filter(change => change.type === 'new')
				.map(change => {
					const partner = partnersData.find(part => part.id === change[partnerField]);
					return partner ? { ...partner, relationshipId: change.id } : null;
				})
				.filter(part => part !== null);

			const combinedMappedPartners = removeDuplicates([...initialMappedPartners, ...newChangesMapped]);

			setPartnerEntities(combinedMappedPartners);
		} catch (error) {
			console.error(`Failed to fetch ${keyType.toLowerCase()} mappings:`, error);
		}
	};

	const fetchAvailablePartners = async () => {
		try {
			const partners = partnerEntityData!.entities
				.filter(partner => partner.id !== -1)
				.map(partner => ({
					id: partner.id,
					entityName: partner.entityName,
					// Use getFieldValue to safely retrieve displayNum
					displayNum: getFieldValue("displayNum", partner) ?? null,
				}));
			setUnmappedPartners(partners);
		} catch (error) {
			console.error(`Failed to fetch ${partnerType.toLowerCase()}s:`, error);
		}
	};

	useEffect(() => {
		setupPartnerEntities();
		fetchAvailablePartners();
	}, [keyId, keyType, partnerType, entityRelationData.entities, partnerEntityData!.entities]);

	const rollbackChanges = async () => {
		await setupPartnerEntities();
		setCurrentChanges([]);
	};

	const handleAddPartner = (partnerId: number) => {
		const keyField = getField(keyType);
		const partnerField = getField(partnerType);

		// Check in partnerEntities to ensure avoiding duplicates
		if (partnerEntities.some(partner => partner.id === partnerId)) return;

		const newRelationship = {
			...getEntityDefault<IEntityRelationship>(EntityTypes.EntityRelationship).defaultEntity,
			[keyField]: keyId,
			[partnerField]: partnerId,
			type: "new",
		};

		const newMapping = unmappedPartners.find(part => part.id === partnerId);
		if (newMapping) {
			setPartnerEntities(removeDuplicates(
				[...partnerEntities, { ...newMapping, relationshipId: newRelationship.id }]
			));
			setCurrentChanges([...currentChanges, newRelationship]);
			setSelectedPartnerId(""); // Reset the selection back to default
		}
	};

	const handleRemovePartner = (partnerId: number) => {
		const partnerField = getField(partnerType);

		const relationship = partnerEntities.find(part => part.id === partnerId);
		if (relationship) {
			const deleteRelationship = {
				relationshipId: relationship.relationshipId,
				id: entityRelationData.getNextId(),
				type: "delete"
			};

			// Remove from currentChanges where type is 'new'
			setCurrentChanges(currentChanges.filter(change => !(change.type === 'new' && change[partnerField] === partnerId)));
			setPartnerEntities(partnerEntities.filter(part => part.id !== partnerId));

			// Add to changes so actual deletions are tracked
			setCurrentChanges(changes => [...changes, deleteRelationship]);
		}
	};

	const saveRelationships = async () => {
		if (currentChanges.length === 0) return;

		for (const change of currentChanges) {
			try {
				if (change.type === "new") {
					const changeToSave = { ...change }; // Create a shallow copy
					delete changeToSave.type; // Remove the 'type' field
					await client.models.entityRelationships.create(changeToSave);
				} else if (change.type === "delete") {
					await client.models.entityRelationships.delete({ id: change.relationshipId });
				}
			} catch (error) {
				console.error(`Failed to ${change.type} relationship with id: ${change.id}`, error);
			}
		}

		setCurrentChanges([]);
		await setupPartnerEntities();
	};

	useImperativeHandle(ref, () => ({
		saveRelationships,
		cancelRelationships: rollbackChanges,
	}));

	return (
		<div className="manage-relationships-container">
			<h2>Manage {keyType} to {partnerType} Mappings</h2>
			<div>
				<h3>Current Mappings</h3>
				<ul>
					{partnerEntities
						.filter(partner => partner.id !== -1)
						.map((partner) => (
							<li key={`${partner.id}-${partner.relationshipId}`}>
								{partner.entityName}
								<button onClick={() => handleRemovePartner(partner.id)}>Remove</button>
							</li>
						))}
				</ul>
			</div>

			<div>
				<h3>Add New Mapping</h3>
				<select
					value={selectedPartnerId}
					onChange={(e) => setSelectedPartnerId(Number(e.target.value))}
					defaultValue=""
				>
					<option value="" disabled>Select {partnerType}</option>
					{unmappedPartners
						.filter(partner => partner.id !== -1)
						.map((partner) => (
							<option key={partner.id} value={partner.id}>
								{partner.entityName}
							</option>
						))}
				</select>
				<button
					disabled={selectedPartnerId === ""}
					onClick={() => handleAddPartner(selectedPartnerId as number)}
				>
					Add Partner
				</button>
			</div>
		</div>
	);
};

export default forwardRef<ManageRelationshipsHandle, ManageRelationshipsProps>(ManageRelationships);
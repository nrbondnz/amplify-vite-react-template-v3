﻿import { useState, ChangeEvent } from 'react';
import { useSubscription } from "@context/SubscriptionContext";
import { useEntityData } from "../../hooks/useEntityData";
import {
	EntityTypes,
	ILocation,
	WithId
} from '../../shared/types/types';

interface NewEntityProps<T extends WithId> {
	entity: T;
	entityName: string;
	onSave: (entity: T) => void;
	onCancel: () => void;
	onEntityChange?: (updatedEntity: T) => void; // Optional prop for entity change
}

const requiredDisplayNamesMap: {
	[key in EntityTypes]?: { [field: string]: string }
} = {
	[EntityTypes.User]: { email: 'Email', entityName: 'Name', idLocation: 'Location ID' },
	[EntityTypes.Machine]: { entityName: 'Name', displayNum: 'Display Number', idLocation: 'Location ID' },
	[EntityTypes.Exercise]: { entityName: 'Name', idMachine: 'Machine ID', description: 'Description' },
	[EntityTypes.Workout]: { entityName: 'Name', idUser: 'User ID' },
	[EntityTypes.Location]: { entityName: 'Location Town' },
	[EntityTypes.Muscle]: { entityName: 'Name', description: 'Description' },
	[EntityTypes.Setting]: { entityName: 'Name', value: 'Value' },
	[EntityTypes.WorkoutExercise]: { entityName: 'Name', idUser: 'User ID', idWorkout: 'Workout ID', idExercise: 'Exercise ID' }
};

const NewEntity = <T extends WithId>({ entity, entityName, onSave, onCancel, onEntityChange }: NewEntityProps<T>) => {
	const [newEntity, setNewEntity] = useState<T>(entity);
	const { addCustomEvent } = useSubscription();

	// Fetch locations
	const { entities: locations, loading: locationsLoading, error: locationsError } = useEntityData<ILocation>(EntityTypes.Location);

	const handleChange = (key: keyof T, value: T[keyof T]) => {
		const updatedEntity = {
			...newEntity,
			[key]: value,
		};
		setNewEntity(updatedEntity);

		if (onEntityChange) {
			onEntityChange(updatedEntity);
		}
	};

	// Fetch required fields and display names based on the entity type
	const entityType = entityName as EntityTypes;
	const requiredFieldsMap = requiredDisplayNamesMap[entityType];

	// Debugging: Log requiredFieldsMap
	console.log(`entityType: ${entityType}`, requiredFieldsMap);

	const requiredFields = requiredFieldsMap ? Object.keys(requiredFieldsMap) : [];

	const hasAllRequiredFields = (entity: T): boolean => {
		return requiredFields.every(field => entity[field as keyof T] !== undefined && entity[field as keyof T] !== null);
	};

	const handleSave = () => {
		if (hasAllRequiredFields(newEntity)) {
			console.log("Saving entity:", newEntity);
			onSave(newEntity);
		} else {
			console.error("Entity is missing required fields:", newEntity);
			// Optionally add user notification for missing fields here
		}
	};

	const handleCancel = () => {
		onCancel();
		addCustomEvent(entityName, "CANCEL_REQUEST", newEntity.id as number);
	};

	const isBasicType = (value: unknown): value is string | number | boolean => {
		return ['string', 'number', 'boolean'].includes(typeof value);
	};

	const renderField = (key: string, value: unknown) => {
		const displayName = requiredFieldsMap ? requiredFieldsMap[key] : key; // Get display name or fallback to key if not found

		if (key === "idLocation") {
			return (
				<tr key={key}>
					<td><label>{displayName}:</label></td>
					<td>
						<select
							value={value !== undefined && value !== null ? String(value) : ""}
							onChange={(e: ChangeEvent<HTMLSelectElement>) =>
								handleChange(key as keyof T, e.target.value as unknown as T[keyof T])
							}
						>
							<option value="" disabled>Select Location</option>
							{locations.map(location => (
								<option key={location.id} value={location.id}>
									{location.entityName}
								</option>
							))}
						</select>
					</td>
				</tr>
			);
		}

		if (isBasicType(value)) {
			return (
				<tr key={key}>
					<td><label>{displayName}:</label></td>
					<td>
						<input
							type="text"
							value={value !== undefined && value !== null ? String(value) : ""}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								handleChange(key as keyof T, e.target.value as unknown as T[keyof T])
							}
							readOnly={key === "id"} // Make the id field read-only
						/>
					</td>
				</tr>
			);
		}

		return null;
	};

	return (
		<div>
			<h2>New {entityName}</h2>
			{locationsLoading && <div>Loading locations...</div>}
			{locationsError && <div>Error loading locations: {locationsError}</div>}

			<table>
				<tbody>
				{Object.keys(newEntity).map((key) => {
					if (key === "id") {
						return null; // Skip rendering the id field for creation
					}
					const value = newEntity[key as keyof T];
					return renderField(key, value);
				})}
				</tbody>
			</table>

			<button disabled={!hasAllRequiredFields(newEntity)} onClick={handleSave}>Save</button>
			<button onClick={handleCancel}>Cancel</button>
		</div>
	);
};

export default NewEntity;
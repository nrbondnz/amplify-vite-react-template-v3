﻿import { useSubscription } from "@context/SubscriptionContext";
import FileLoader from "../../components/utils/FileLoader";
import ShowPicture from "../../components/utils/ShowPicture";
import { useState, ChangeEvent } from "react";
import { useEntityData } from './../../hooks/useEntityData';
import {
	EntityTypes,
	ILocation, WithId,
	WithIdAndDisplayNum
} from '../../shared/types/types';

interface EditEntityProps<T extends WithId> {
	pEntity: T;
	pEntityName: string;
	onSave: (entity: T) => void;
	onDelete: (entity: T) => void;
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

const EditEntity = <T extends WithId>({ pEntity, pEntityName, onSave, onDelete, onCancel, onEntityChange }: EditEntityProps<T>) => {
	const [updatedEntity, setUpdatedEntity] = useState<T>(pEntity);
	const [entityName] = useState<string | null>(pEntityName);
	const { addCustomEvent } = useSubscription();

	// Fetch locations
	const { entities: locations, loading: locationsLoading, error: locationsError } = useEntityData<ILocation>(EntityTypes.Location);

	const handleChange = (key: keyof T, value: T[keyof T]) => {
		const newEntity = {
			...updatedEntity,
			[key]: value,
		};
		setUpdatedEntity(newEntity);
		if (onEntityChange) {
			onEntityChange(newEntity);
		}
	};

	const handleSave = () => onSave(updatedEntity);

	const handleDelete = () => onDelete(updatedEntity);

	const handleCancel = () => {
		onCancel();
		addCustomEvent(pEntityName, "CANCEL_REQUEST", updatedEntity.id);
	};

	const isBasicType = (value: unknown): value is string | number | boolean => {
		return ['string', 'number', 'boolean'].includes(typeof value);
	};

	const entityType = pEntityName as EntityTypes;
	const requiredFieldsMap = requiredDisplayNamesMap[entityType] || {};

	const renderField = (key: string, value: unknown) => {
		const displayName = requiredFieldsMap[key] || key; // Get display name or fallback to key if not found

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
			if (key === 'id') {
				return (
					<tr key={key}>
						<td><label>{displayName}:</label></td>
						<td>{value !== undefined && value !== null ? String(value) : ""}</td>
					</tr>
				);
			}

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
						/>
					</td>
				</tr>
			);
		}

		return null;
	};

	const parseDisplayNum = (displayNum: string | number | undefined): number | undefined => {
		if (typeof displayNum === 'string') {
			const parsed = parseInt(displayNum, 10);
			return isNaN(parsed) ? undefined : parsed;
		}
		return displayNum;
	};

	const isWithIdAndDisplayNum = (entity: any): entity is WithIdAndDisplayNum => {
		return 'displayNum' in entity && 'id' in entity;
	};

	return (
		<div>
			<h2>Edit {pEntityName}</h2>
			{locationsLoading && <div>Loading locations...</div>}
			{locationsError && <div>Error loading locations: {locationsError}</div>}

			<table>
				<tbody>
				{isWithIdAndDisplayNum(updatedEntity) && (
					<tr>
						<td>
							<ShowPicture
								entityDisplayNum={parseDisplayNum(updatedEntity.displayNum)!}
								name={pEntityName}
							/>
						</td>
						<td>
							<FileLoader
								pEntityName={entityName!}
								pDisplayNum={parseDisplayNum(updatedEntity.displayNum)}
							/>
						</td>
					</tr>
				)}
				{Object.keys(updatedEntity).map((key) => {
					const value = updatedEntity[key as keyof T];
					return renderField(key, value);
				})}
				</tbody>
			</table>

			<button onClick={handleSave}>Save</button>
			<button onClick={handleDelete}>Delete</button>
			<button onClick={handleCancel}>Cancel</button>
		</div>
	);
};

export default EditEntity;
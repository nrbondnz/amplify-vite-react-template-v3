import FileLoader from "@components/utils/FileLoader";
import { useState, ChangeEvent } from 'react';
import { useSubscription } from '@context/SubscriptionContext';
import {
	AppEvent,
	EntityTypes,
	ILocation,
	WithId,
	WithIdAndDisplayNum
} from '@shared/types/types';
import { requiredDisplayNamesMap } from '@shared/types/types';
import { useEntityData } from '@hooks/useEntityData';
import ShowPicture from '@components/utils/ShowPicture';

interface EditEntityProps<T> {
	pEntity: T;
	pEntityName: string;
	onSave: (entity: T) => void;
	onDelete: (entity: T) => void;
	onCancel: () => void;
	onEntityChange?: (entity: T) => void;
}

const EditEntity = <T extends WithId>({ pEntity, pEntityName, onSave, onDelete, onCancel, onEntityChange }: EditEntityProps<T>) => {
	const [updatedEntity, setUpdatedEntity] = useState<T>(pEntity);
	const [entityName] = useState<string | null>(pEntityName);
	const { addCustomEvent } = useSubscription();

	// Fetch locations
	const { entities: locations, loading: locationsLoading, error: locationsError } = useEntityData<ILocation>(EntityTypes.Location);

	const handleChange = (key: keyof T, value: T[keyof T]) => {
		const newEntity = { ...updatedEntity, [key]: value };
		setUpdatedEntity(newEntity);
		if (onEntityChange) {
			onEntityChange(newEntity);
		}
	};

	const handleSave = () => onSave(updatedEntity);

	const handleDelete = () => onDelete(updatedEntity);

	const handleCancel = () => {
		onCancel();
		const event: AppEvent = {
			entity: pEntityName,
			entityId: updatedEntity.id,
			actionType: 'CANCEL_REQUEST',
			pageType: 'EDIT'
		};
		addCustomEvent(event);;
	};

	const isBasicType = (value: unknown): value is string | number | boolean => {
		return ['string', 'number', 'boolean'].includes(typeof value);
	};

	const entityType = pEntityName as EntityTypes;
	const requiredFieldsMap = requiredDisplayNamesMap[entityType] || {};

	const renderField = (key: string, value: unknown) => {
		const fieldInfo = requiredFieldsMap[key];

		if (!fieldInfo) {
			return null;
		}

		const { displayName, type } = fieldInfo;

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
			if (type === 'textarea') {
				return (
					<tr key={key}>
						<td><label>{displayName}:</label></td>
						<td>
							<textarea
								value={value !== undefined && value !== null ? String(value) : ""}
								onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
									handleChange(key as keyof T, e.target.value as unknown as T[keyof T])
								}
								rows={3}
								cols={100}
							/>
						</td>
					</tr>
				);
			}

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
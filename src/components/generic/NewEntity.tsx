import { useState, ChangeEvent } from 'react';
import { useSubscription } from "@context/SubscriptionContext";
import { useEntityData } from "../../hooks/useEntityData";
import { EntityTypes, ILocation, WithId } from '../../shared/types/types';

interface NewEntityProps<T extends WithId> {
	entity: T;
	entityName: string;
	onSave: (entity: T) => void;
	onCancel: () => void;
	onEntityChange?: (updatedEntity: T) => void; // Optional prop for entity change
}

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

	const handleSave = () => {
		onSave(newEntity);
	};

	const handleCancel = () => {
		onCancel();
		addCustomEvent(entityName, "CANCEL_REQUEST", newEntity.id as number);
	};

	/*const formatValue = (value: unknown): string => {
		if (typeof value === 'string' || typeof value === 'number') {
			return value.toString();
		}
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		return '';
	};*/

	const isBasicType = (value: unknown): value is string | number | boolean => {
		return ['string', 'number', 'boolean'].includes(typeof value);
	};

	const renderField = (key: string, value: unknown) => {
		if (key === "idLocation") {
			return (
				<tr key={key}>
					<td><label>Location:</label></td>
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
					<td><label>{key}:</label></td>
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

	return (
		<div>
			<h2>New {entityName}</h2>
			{locationsLoading && <div>Loading locations...</div>}
			{locationsError && <div>Error loading locations: {locationsError}</div>}

			<table>
				<tbody>
				{Object.keys(newEntity).map((key) => {
					const value = newEntity[key as keyof T];
					return renderField(key, value);
				})}
				</tbody>
			</table>

			<button onClick={handleSave}>Save</button>
			<button onClick={handleCancel}>Cancel</button>
		</div>
	);
};

export default NewEntity;
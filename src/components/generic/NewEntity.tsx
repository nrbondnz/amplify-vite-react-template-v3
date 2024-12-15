import { useDataContext } from "@context/DataContext";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { useState, ChangeEvent, useEffect } from 'react';
import { useSubscription } from "@context/SubscriptionContext";

import {
	AppEvent,
	EntityTypes,
	WithId
} from '@shared/types/types';

interface NewEntityProps<T extends WithId> {
	entity: T;
	entityName: string;
	onSave: (entity: T) => void;
	onCancel: () => string;
	onEntityChange?: (updatedEntity: T) => void; // Optional prop for entity change
}

const requiredDisplayNamesMap: { [key in EntityTypes]?: { [field: string]: string } } = {
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
	const dataContext = useDataContext();
	// Fetch locations
	const { entities: locations, loading: locationsLoading, error: locationsError } = dataContext.lM;
	const [user, setUser] = useState<AuthUser>();

	// Check if the object has a specified field
	const hasField = (obj: any, field: string): boolean => {
		return obj.hasOwnProperty(field);
	};

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const currentUser: AuthUser = await getCurrentUser(); // Await the promise
				setUser(currentUser); // Set the resolved user

				// Update the `newEntity` with programmatic values for `idUser`
				let updatedEntity = { ...newEntity };
				if (hasField(newEntity, 'idUser')) {
					updatedEntity = { ...updatedEntity, idUser: currentUser.userId }; // Programmatically set the user ID
				}

				// Update `idLocation` if applicable
				if (hasField(newEntity, 'idLocation') && locations.length > 0) {
					updatedEntity = { ...updatedEntity, idLocation: locations[0].id };
				}

				// Update the state and notify changes if required
				setNewEntity(updatedEntity);
				if (onEntityChange) {
					onEntityChange(updatedEntity);
				}
			} catch (error) {
				console.error('Error fetching current user:', error);
			}
		};

		fetchCurrentUser(); // Call the async function
	}, [onEntityChange]);

	const handleChange = (key: keyof T, value: T[keyof T]) => {
		const updatedEntity = { ...newEntity, [key]: value };
		setNewEntity(updatedEntity);

		if (onEntityChange) {
			onEntityChange(updatedEntity);
		}
	};

	// Fetch required fields and display names based on the entity type
	const entityType = entityName as EntityTypes;
	const requiredFieldsMap = requiredDisplayNamesMap[entityType];

	const requiredFields = requiredFieldsMap ? Object.keys(requiredFieldsMap) : [];

	const hasAllRequiredFields = (entity: T): boolean => {
		return requiredFields.every(
			(field) =>
				entity[field as keyof T] !== undefined &&
				entity[field as keyof T] !== null &&
				entity[field as keyof T] !== 0
		);
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
		const done = onCancel();
		if (done && done.length > 0) {
			const event: AppEvent = {
				entity: entityName,
				actionType: 'CANCEL_REQUEST',
				pageType: done // not top level
			};
			addCustomEvent(event);
		} else {
			console.error("onCancel() returned an invalid string:", done);
		}
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
			if (key === 'idUser') {
				// Display the user's login email but set `idUser` programmatically
				return (
					<tr key={key}>
						<td><label>{displayName || 'User'}:</label></td>
						<td>
							<input
								type="text"
								value={user?.signInDetails?.loginId || "Loading..."} // Display
								// login email or "Loading..."
								readOnly
							/>
						</td>
					</tr>
				);
			}

			if (key === 'description') {
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
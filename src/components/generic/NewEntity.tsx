// src/components/generic/NewEntity.tsx
import { useState } from 'react';

interface NewEntityProps<T> {
	entity: T;
	entityName: string;
	onSave: (entity: T) => void;
	onCancel: () => void;
}

const NewEntity = <T extends object>({ entity, entityName, onSave, onCancel }: NewEntityProps<T>) => {
	const [newEntity, setNewEntity] = useState<T>(entity);

	const handleChange = (key: keyof T, value: string) => {
		setNewEntity({
			...newEntity,
			[key]: value,
		});
	};

	const handleSave = () => {
		onSave(newEntity);
	};
	
	const handleCancel = () => {
		onCancel();
	}

	const formatValue = (value: unknown): string => {
		if (typeof value === 'string' || typeof value === 'number') {
			return value.toString();
		}
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		return '';
	};

	function isBasicType(key: string) {
		return !(key === 'id' || key === 'createdAt' || key === 'updatedAt');
	}

	return (
		<div>
			<h2>New {entityName}</h2>
			{Object.keys(newEntity).map((key) => {
				const value = newEntity[key as keyof T];
				if (isBasicType(key)) {
					return (
						<div key={key}>
							<label>{key}:</label>
							<input
								type="text"
								value={formatValue(value)}
								onChange={(e) => handleChange(key as keyof T, e.target.value)}
							/>
						</div>
					);
				}
				return null;
			})}
			<button onClick={handleSave}>Save</button>
			<button onClick={handleCancel}>Cancel</button>
		</div>
	);
};

export default NewEntity;
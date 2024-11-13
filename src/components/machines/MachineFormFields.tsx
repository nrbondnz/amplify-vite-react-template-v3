// src\components\machines\MachineFormFields.tsx
import React from 'react';
import { IMachine } from '@shared/types/types';

interface MachineFormFieldsProps {
	machine: IMachine;
	locations: { id: number; name: string }[];
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const MachineFormFields: React.FC<MachineFormFieldsProps> = ({ machine, locations, onChange }) => {
	return (
		<>
			<div>
				<label htmlFor="machine-name">Name:</label>
				<input id="machine-name" type="text" name='name' value={machine.entityName} onChange={onChange} required aria-label="Machine Name" />
			</div>
			<div>
				<label htmlFor="machine-number">Number of Machines:</label>
				<input id="machine-number" type="number" name='numOfMachine' value={machine.displayNum} onChange={onChange} required aria-label="Number of Machines" />
			</div>
			<div>
				<label htmlFor="machine-location">Location:</label>
				<select id="machine-location" name='idLocation' value={machine.idLocation} onChange={onChange} required aria-label="Location">
					<option value="">Select Location</option>
					{locations.map((location) => (
						<option key={location.id} value={location.id}>{location.name}</option>
					))}
				</select>
			</div>
		</>
	);
}

export default MachineFormFields;
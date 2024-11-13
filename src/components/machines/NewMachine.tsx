//import { useEntityData } from "@hooks/useEntityData";
import React from 'react';
import NewEntity from "@components/generic/NewEntity";
import { client } from "@shared/utils/client";
import withEntityData from '@components/generic/withEntityData';
import {
	defaultMachine,
	EntityTypes,
	IMachine,
} from '@shared/types/types';
import { useNavigate } from 'react-router-dom';
import ManageSettings from './ManageSettings';

interface NewMachineProps {
	loading: boolean;
	getNextId: () => number;
}

const NewMachine: React.FC<NewMachineProps> = ({ loading, getNextId }) => {
	
	// Destructure useEntityData and rename getNextId to getNextSessionId
	//const { loading: dataLoading, getNextId: getNextSessionId } =
	// useEntityData<ISetting>(EntityTypes.Setting);

	const navigate = useNavigate();

	// Combine the loading states
	if (loading ) {
		return <div>Loading...</div>;
	}

	const handleSave = async (newEntity: IMachine) => {
		try {
			newEntity.id = getNextId(); // Assign the next ID using getNextId()

			// Save the machine entity
			const savedMachine = await client.models.machines.create(newEntity);
			console.log('Saving entity:', savedMachine);

			// Loop over the settings and update each with the new entity ID
		

			// Navigate to /appcontent after saving
			navigate('/appcontent');
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	

	return (
		<>
			<NewEntity entity={defaultMachine} entityName="Machine" onSave={handleSave} onCancel={() => { navigate('/Machines') }} />
			<ManageSettings entityType={EntityTypes.Machine} entityId={-1} onSaveRef={()=>{}}/>
		</>
	);
};

export default withEntityData<IMachine>(EntityTypes.Machine)(NewMachine);
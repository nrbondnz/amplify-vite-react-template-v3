// src/components/locations/EditLocation.tsx
import { client } from "@shared/utils/client";
//import { deleteLocations } from "mutations";
import React from 'react';
import {  useParams } from 'react-router-dom';
import EditEntity from '@components/generic/EditEntity';
import withEntityData from '@components/generic/withEntityData';
import { EntityTypes, ILocation } from '@shared/types/types';
import { useNavigate } from 'react-router-dom';

interface EditLocationProps {
	entities: ILocation[];
	getEntityById: (id: string) => ILocation | null;
	loading: boolean;
}
const EditLocation: React.FC<EditLocationProps> = ({ getEntityById, loading }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate(); // Use the useNavigate hook

	if (loading) {
		return <div>Loading...</div>;
	}

	const entity = getEntityById(id!);

	if (!entity) {
		return <div>Entity not found</div>;
	}

	const handleSave = async (updatedEntity: ILocation) => {
		try {
			await client.models.locations.update(updatedEntity);
			console.log('Saving entity:', updatedEntity);
			navigate('/appcontent'); // Navigate to /locations after saving
		} catch (error) {
			console.error('Failed to save the entity:', error);
		}
	};

	const handleDelete = async (updatedEntity: ILocation) => {
		try {
			client.models.locations.delete({id:updatedEntity.id})
			console.log('Deleting entity:', updatedEntity);
			console.log("Post delete : ", client.models.locations.list);
			navigate('/appcontent'); // Navigate to /locations after saving
		} catch (error) {
			console.error('Failed to delete the entity:', error);
		}
	};
	
	const handleCancel = () => {
		navigate('/locations');
	}

	return <EditEntity pEntity={entity} pEntityName="locations"  onSave={handleSave} onDelete={handleDelete} onCancel={handleCancel} />;
};

export default withEntityData<ILocation>(EntityTypes.Location)(EditLocation);
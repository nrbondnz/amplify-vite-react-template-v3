import FileLoader from "@components/utils/FileLoader";
import ShowPicture from "@components/utils/ShowPicture";
import React, { useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	EntityTypes,
	ISettingWithStatus,
	SettingKeys
} from '@shared/types/types';
import { useEntityData } from '@hooks/useEntityData';
import { client } from '@shared/utils/client';

// Define a type that allows omitting specific fields for sanitization
type SettingSanitizable = Omit<ISettingWithStatus, 'status'> & Partial<ISettingWithStatus>;

const sanitizeObject = (obj: SettingSanitizable, fields: (keyof SettingSanitizable)[]): SettingSanitizable => {
	const sanitized = { ...obj };
	fields.forEach(field => delete sanitized[field]);
	return sanitized;
};

interface ManageSettingsProps {
	entityId?: number;
	entityNum?: number;
	entityType?: EntityTypes;
	onSaveRef: React.Ref<{
		saveSettings: () => ISettingWithStatus[],
		saveSettingsToDB: (settings: ISettingWithStatus[]) => Promise<void>,
		settingsChanged: () => boolean
	}>;
}

const ManageSettings: React.FC<ManageSettingsProps> = forwardRef(({ entityId, entityNum, entityType, onSaveRef }, _ref) => {
	const params = useParams<{ entityId: string; entityType: EntityTypes }>();
	const displaySaveButton = params.entityId !== undefined;
	// Use entityId and entityType from params if available, otherwise fallback to props
	const finalEntityId = entityId ?? parseInt(params.entityId!);
	const finalEntityType = entityType ?? params.entityType;
	//const { getEntityById } = useEntityData<IMachine>(EntityTypes.Machine);
	const { entities: settings, setEntities: setSettings, getNextId: getNextSettingId } = useEntityData<ISettingWithStatus>(EntityTypes.Setting);
	const [originalSettings, setOriginalSettings] = useState<ISettingWithStatus[]>([]);
	const [filteredSettings, setFilteredSettings] = useState<ISettingWithStatus[]>([]);
	//const displayId = getEntityById(finalEntityId.toString())?.displayNum;
	useImperativeHandle(onSaveRef, () => ({
		saveSettings: () => settings,
		saveSettingsToDB,
		settingsChanged: () => settings.some((setting, index) => (
			setting.entityName !== originalSettings[index]?.entityName ||
			setting.value !== originalSettings[index]?.value ||
			setting.status !== originalSettings[index]?.status
		))
	}));

	useEffect(() => {
		const settingsForEntity = settings.filter(setting => setting.entityId === finalEntityId && setting.entityType === finalEntityType && setting.status !== 'delete');
		setFilteredSettings(settingsForEntity);
		setOriginalSettings([...settingsForEntity]);
	}, [entityId, settings, finalEntityId, finalEntityType, entityNum]);

	const handleSettingsChange = (action: SettingKeys, mySetting?: ISettingWithStatus, name?: string, value?: string) =>
		setSettings((prevSettings: ISettingWithStatus[]) => {
			let updatedSettings = [...prevSettings];
			let newSetting: ISettingWithStatus;
			switch (action) {
				case SettingKeys.add:
					newSetting = {
						id: getNextSettingId(),
						entityName: '',
						value: '',
						entityId: finalEntityId,
						entityType: finalEntityType!,
						status: 'new'
					};
					console.log('Adding new setting:', newSetting);
					updatedSettings.push(newSetting);
					break;
				case SettingKeys.remove:
					updatedSettings = updatedSettings.map(setting =>
						setting.id === mySetting!.id
							? { ...setting, status: 'delete' }
							: setting
					);
					break;
				case SettingKeys.changeKey:
					updatedSettings = updatedSettings.map(setting =>
						setting.id === mySetting!.id
							? { ...setting, name: name || setting.entityName, status: setting.status === 'new' ? 'new' : 'update' }
							: setting
					);
					break;
				case SettingKeys.change:
					updatedSettings = updatedSettings.map(setting =>
						setting.id === mySetting!.id
							? { ...setting, value: value !== undefined ? value : setting.value, status: setting.status === 'new' ? 'new' : 'update' }
							: setting
					);
					break;
				default:
					break;
			}
			console.log('Updated settings after change:', updatedSettings);
			return updatedSettings;
		});

	const handleKeyChange = (setting: ISettingWithStatus, newName: string) => {
		console.log(`Changing key for setting ID ${setting.id} to ${newName}`);
		handleSettingsChange(SettingKeys.changeKey, setting, newName);
	};

	const handleValueChange = (setting: ISettingWithStatus, newValue: string) => {
		console.log(`Changing value for setting ID ${setting.id} to ${newValue}`);
		handleSettingsChange(SettingKeys.change, setting, undefined, newValue);
	};

	const addNewSetting = () => {
		console.log('Triggering Add New Setting');
		handleSettingsChange(SettingKeys.add);
	};

	const removeSetting = (mySetting: ISettingWithStatus) => {
		console.log(`Removing setting ID ${mySetting.id}`);
		handleSettingsChange(SettingKeys.remove, mySetting);
	};

	const saveSettingsToDB = async (settings: ISettingWithStatus[]) => {
		for (const setting of settings) {
			const sanitizedSetting = sanitizeObject(setting, ['status']);
			try {
				if (setting.status === 'new') {
					await client.models.settings.create(sanitizedSetting);
				} else if (setting.status === 'update') {
					await client.models.settings.update(sanitizedSetting);
				} else if (setting.status === 'delete') {
					await client.models.settings.delete({ id: setting.id });
				}
			} catch (error) {
				console.error(`Failed to save setting ${setting.id}:`, error);
			}
		}
	};

	console.log('ManageSettings: Current settings', settings);

	return (
		<div>
			<h3>Settings</h3>
			{filteredSettings.map(setting => (
				<div key={setting.id}>
					<input
						type="text"
						value={setting.entityName || ''}
						onChange={(e) => handleKeyChange(setting, e.target.value)}
					/>
					<input
						type="text"
						value={setting.value ?? ''}
						onChange={(e) => handleValueChange(setting, e.target.value)}
					/>
					<ShowPicture entityDisplayNum={entityNum!} name={entityType!.valueOf()} details={setting.entityName!}/>
					<FileLoader pEntityName={entityType!.valueOf()} pDisplayNum={entityNum} pDetails={setting.entityName!} />
					<button type="button" onClick={() => removeSetting(setting)}>Remove</button>
				</div>
			))}
			<button type="button" onClick={addNewSetting}>Add Setting</button>
			{displaySaveButton && (
				<button type="button" onClick={() => saveSettingsToDB(settings)}>
					Save Settings
				</button>
			)}
		</div>
	);
});

export default ManageSettings;
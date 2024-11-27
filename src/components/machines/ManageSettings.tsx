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
	const finalEntityId = entityId ?? parseInt(params.entityId!);
	const finalEntityType = entityType ?? params.entityType;
	const { entities: settings, setEntities: setSettings, getNextId: getNextSettingId } = useEntityData<ISettingWithStatus>(EntityTypes.Setting);
	const [originalSettings, setOriginalSettings] = useState<ISettingWithStatus[]>([]);
	const [filteredSettings, setFilteredSettings] = useState<ISettingWithStatus[]>([]);
	const [settingsStatus, setSettingsStatus] = useState<{ [key: number]: string }>({});

	useImperativeHandle(onSaveRef, () => ({
		saveSettings: () => settings,
		saveSettingsToDB,
		settingsChanged: () => settings.some((setting, index) => (
			setting.entityName !== originalSettings[index]?.entityName ||
			setting.value !== originalSettings[index]?.value ||
			settingsStatus[setting.id] !== (originalSettings[index]?.status ?? '')
		))
	}));

	useEffect(() => {
		const settingsForEntity = settings.filter(setting => setting.entityId === finalEntityId && setting.entityType === finalEntityType);
		setFilteredSettings(settingsForEntity);
		setOriginalSettings([...settingsForEntity]);

		const statusMap: { [key: number]: string } = {};
		settingsForEntity.forEach(setting => {
			statusMap[setting.id] = setting.status ?? '';
		});
		setSettingsStatus(statusMap);
	}, [entityId, settings, finalEntityId, finalEntityType, entityNum]);

	const handleSettingsChange = (action: SettingKeys, mySetting?: ISettingWithStatus, name?: string, value?: string) => {
		setSettings((prevSettings: ISettingWithStatus[]) => {
			let updatedSettings = [...prevSettings];
			const updatedStatus = { ...settingsStatus };

			switch (action) {
				case SettingKeys.add:
					const newSetting: ISettingWithStatus = {
						id: getNextSettingId(),
						entityName: '',
						value: '',
						entityId: finalEntityId,
						entityType: finalEntityType!,
						status: 'new'
					};
					console.log('Adding new setting:', newSetting);
					updatedSettings.push(newSetting);
					updatedStatus[newSetting.id] = 'new';
					break;
				case SettingKeys.remove:
					updatedSettings = updatedSettings.map(setting =>
						setting.id === mySetting!.id
							? { ...setting, status: 'delete' }
							: setting
					);
					updatedStatus[mySetting!.id] = 'delete';
					break;
				case SettingKeys.changeKey:
					updatedSettings = updatedSettings.map(setting =>
						setting.id === mySetting!.id
							? { ...setting, entityName: name ?? '', status: updatedStatus[setting.id] === 'new' ? 'new' : 'update' }
							: setting
					);
					updatedStatus[mySetting!.id] = updatedStatus[mySetting!.id] === 'new' ? 'new' : 'update';
					break;
				case SettingKeys.change:
					updatedSettings = updatedSettings.map(setting =>
						setting.id === mySetting!.id
							? { ...setting, value: value ?? '', status: updatedStatus[setting.id] === 'new' ? 'new' : 'update' }
							: setting
					);
					updatedStatus[mySetting!.id] = updatedStatus[mySetting!.id] === 'new' ? 'new' : 'update';
					break;
				default:
					break;
			}

			console.log('Updated settings after change:', updatedSettings);
			setSettingsStatus(updatedStatus);
			return updatedSettings;
		});
	};

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
				if (settingsStatus[setting.id] === 'new') {
					console.log('Attempting to create new setting with:', sanitizedSetting);
					const result = await client.models.settings.create(sanitizedSetting);
					console.log('Created new setting:', result);
				} else if (settingsStatus[setting.id] === 'update') {
					console.log('Attempting to update setting with:', sanitizedSetting);
					await client.models.settings.update(sanitizedSetting);
				} else if (settingsStatus[setting.id] === 'delete') {
					console.log('Attempting to delete setting with id:', setting.id);
					await client.models.settings.delete({ id: setting.id });
				}
			} catch (error) {
				console.error(`Failed to save setting ${setting.id}:`, error);
				console.error('Sanitized setting content:', JSON.stringify(sanitizedSetting, null, 2));
			}
		}
	};

	console.log('ManageSettings: Current settings', settings);
	console.log('ManageSettings: setting status', settingsStatus);

	return (
		<div>
			<h3>Settings</h3>
			{filteredSettings
				.filter(setting => settingsStatus[setting.id] !== 'delete')
				.map(setting => (
					<div key={setting.id}>
						<input
							type="text"
							value={setting.entityName || ''}
							placeholder="Enter name"
							onChange={(e) => handleKeyChange(setting, e.target.value)}
							className="input-field"
						/>
						<input
							type="text"
							value={setting.value ?? ''}
							placeholder="Enter value"
							onChange={(e) => handleValueChange(setting, e.target.value)}
							className="input-field"
						/>
						<ShowPicture entityDisplayNum={entityNum!} name={entityType!.valueOf()} details={setting.entityName!}/>
						<FileLoader pEntityName={entityType!.valueOf()} pDisplayNum={entityNum} pDetails={setting.entityName!} />
						<button type="button" onClick={() => removeSetting(setting)} className="button">Remove</button>
					</div>
				))}
			<button type="button" onClick={addNewSetting} className="button">Add Setting</button>
			{/* If needed, uncomment the Save Settings button */}
			{/* <button type="button" onClick={() => saveSettingsToDB(settings)} className="button">Save Settings</button> */}
		</div>
	);
});

export default ManageSettings;
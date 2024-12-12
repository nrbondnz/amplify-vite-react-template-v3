import FileLoader from "@components/utils/FileLoader";
import ShowPicture from "@components/utils/ShowPicture";
import { useDataContext } from "@context/DataContext";
import "./ManageSettings.css";
import { SettingsManager } from "@shared/types/IEntityManager";
import {
	EntityTypes,
	ISetting,
	ISettingWithStatus,
	SettingKeys,
	SettingStatus,
} from "@shared/types/types";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState
} from "react";
import { useParams } from "react-router-dom";

import "./ManageSettings.css";

type SettingSanitizable = Omit<ISettingWithStatus, "status"> & Partial<ISettingWithStatus>;

const sanitizeObject = (obj: SettingSanitizable, fields: (keyof SettingSanitizable)[]): SettingSanitizable => {
	const sanitized = { ...obj };
	fields.forEach((field) => delete sanitized[field]);
	return sanitized;
};

interface ManageSettingsProps {
	entityId?: number;
	entityNum?: number;
	entityType?: EntityTypes;
	onSaveRef: React.Ref<{
		saveSettings: () => ISetting[];
		saveSettingsToDB: (settings: ISetting[]) => Promise<void>;
		settingsChanged: () => boolean;
	}>;
}

const areObjectsEqual = (obj1: object, obj2: object) => JSON.stringify(obj1) === JSON.stringify(obj2);

const ManageSettings: React.FC<ManageSettingsProps> = forwardRef(
	({ entityId, entityNum, entityType, onSaveRef }, _ref) => {
		const params = useParams<{ entityId: string; entityType: EntityTypes }>();
		const finalEntityId = entityId ?? parseInt(params.entityId!, 10);
		const finalEntityType = entityType ?? params.entityType;
		const dataContext = useDataContext();
		const settingsManager = dataContext.getManagerByType(EntityTypes.Setting) as SettingsManager;

		if (!settingsManager) {
			console.error("Settings Manager is not available.");
			return null;
		}

		const [settingsStatus, setSettingsStatus] = useState<{ [key: number]: SettingStatus }>({});

		// Convert settings to include statuses
		const initializeSettings = (): ISettingWithStatus[] => {
			return (settingsManager.entities).map((entity) => ({
				...entity,
				status: SettingStatus.unchanged,
			}));
		};

		const [currentSettings, setCurrentSettings] = useState<ISettingWithStatus[]>(initializeSettings);

		useImperativeHandle(onSaveRef, () => ({
			saveSettings: () => currentSettings,
			saveSettingsToDB,
			settingsChanged: () =>
				currentSettings.some((setting) => {
					const originalSetting = settingsManager.filterById(setting.id)[0] as ISettingWithStatus;
					return (
						!originalSetting ||
						setting.entityName !== originalSetting.entityName ||
						setting.value !== originalSetting.value ||
						settingsStatus[setting.id] !== (originalSetting.status ?? "")
					);
				}),
		}));

		useEffect(() => {
const settingsForEntity: ISettingWithStatus[] = (settingsManager.entities as ISetting[])
				.filter((setting) => setting.entityId === finalEntityId && setting.entityType === finalEntityType)
				.map((setting) => ({
					...setting,
					status: settingsStatus[setting.id] || SettingStatus.unchanged, // Add status
					// if not already present
				}));

			setCurrentSettings(settingsForEntity);

			const statusMap: { [key: number]: SettingStatus } = {};
			settingsForEntity.forEach((setting) => {
				statusMap[setting.id] = setting.status ?? SettingStatus.unchanged;
			});

			if (!areObjectsEqual(statusMap, settingsStatus)) {
				setSettingsStatus(statusMap);
			}
		}, [settingsManager, finalEntityId, finalEntityType]);

		const handleSettingsChange = (
			action: SettingKeys,
			mySetting?: ISettingWithStatus,
			name?: string,
			value?: string
		) => {
			setCurrentSettings((prevSettings) => {
				let updatedSettings = [...prevSettings];
				const updatedStatus = { ...settingsStatus };

				switch (action) {
					case SettingKeys.add:
						const newSetting: ISettingWithStatus = {
							id: settingsManager.getNextId(),
							entityName: "",
							value: "",
							entityId: finalEntityId,
							entityType: finalEntityType!,
							status: SettingStatus.new,
						};
						updatedSettings.push(newSetting);
						updatedStatus[newSetting.id] = SettingStatus.new;
						break;

					case SettingKeys.remove:
						updatedSettings = updatedSettings.map((setting) =>
							setting.id === mySetting?.id ? { ...setting, status: SettingStatus.delete } : setting
						);
						if (mySetting) updatedStatus[mySetting.id] = SettingStatus.delete;
						break;

					case SettingKeys.changeKey:
						updatedSettings = updatedSettings.map((setting) =>
							setting.id === mySetting?.id && setting.entityName !== name
								? {
									...setting,
									entityName: name ?? "",
									status: updatedStatus[setting.id] === SettingStatus.new ? SettingStatus.new : SettingStatus.update,
								}
								: setting
						);
						if (mySetting?.id) {
							updatedStatus[mySetting.id] = updatedStatus[mySetting.id] === SettingStatus.new ? SettingStatus.new : SettingStatus.delete
						}
						break;

					case SettingKeys.change:
						updatedSettings = updatedSettings.map((setting) =>
							setting.id === mySetting?.id && setting.value !== value
								? {
									...setting,
									value: value ?? "",
									status: updatedStatus[setting.id] === SettingStatus.new ? SettingStatus.new : SettingStatus.update,
								}
								: setting
						);
						if (mySetting?.id) {
							updatedStatus[mySetting.id] = updatedStatus[mySetting.id] === SettingStatus.new ? SettingStatus.new : SettingStatus.delete;
						}
						break;

					default:
						break;
				}

				if (!areObjectsEqual(updatedStatus, settingsStatus)) {
					setSettingsStatus(updatedStatus);
				}

				return updatedSettings;
			});
		};

		const saveSettingsToDB = async (settings: ISettingWithStatus[]) => {
			for (const setting of settings) {
				const sanitizedSetting = sanitizeObject(setting, ["status"]);
				try {
					if (settingsStatus[setting.id] === SettingStatus.new) {
						console.log("Creating a new setting:", sanitizedSetting);
					} else if (settingsStatus[setting.id] === SettingStatus.update) {
						console.log("Updating a setting:", sanitizedSetting);
					} else if (settingsStatus[setting.id] === SettingStatus.delete) {
						console.log("Deleting a setting:", setting.id);
					}
				} catch (error) {
					console.error(`Failed to save setting ${setting.id}:`, error);
				}
			}
		};

		return (
			<div className="settings-container">
				<h3>Settings</h3>
				{currentSettings
					.filter((setting) => setting.status !== SettingStatus.delete)
					.map((setting) => (
						<div key={setting.id} className="settings-item">
							<input
								type="text"
								value={setting.entityName || ""}
								placeholder="Enter name"
								onChange={(e) => handleSettingsChange(SettingKeys.changeKey, setting, e.target.value)}
								className="input-field"
							/>
							<input
								type="text"
								value={setting.value ?? ""}
								placeholder="Enter value"
								onChange={(e) => handleSettingsChange(SettingKeys.change, setting, undefined, e.target.value)}
								className="input-field"
							/>
							<table className="settings-table">
								<tbody>
								<tr>
									<td className="settings-cell">
										<ShowPicture
											entityDisplayNum={entityNum!}
											name={finalEntityType!.valueOf()}
											details={setting.entityName!}
										/>
									</td>
									<td className="settings-cell file-loader-cell">
										<FileLoader
											pEntityName={finalEntityType!.valueOf()}
											pDisplayNum={entityNum}
											pDetails={setting.entityName!}
										/>
									</td>
								</tr>
								</tbody>
							</table>
							<button
								type="button"
								onClick={() => handleSettingsChange(SettingKeys.remove, setting)}
								className="button"
							>
								Remove
							</button>
						</div>
					))}
				<button
					type="button"
					onClick={() => handleSettingsChange(SettingKeys.add)}
					className="button"
				>
					Add Setting
				</button>
			</div>
		);
	}
);

export default ManageSettings;
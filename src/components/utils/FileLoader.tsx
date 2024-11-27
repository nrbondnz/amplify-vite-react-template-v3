import React, { useState, useEffect, useCallback } from "react";
import { Amplify } from "aws-amplify";
import { uploadData, getUrl } from "aws-amplify/storage";
import outputs from "../../../amplify_outputs.json";
import "./FileLoader.css";

Amplify.configure(outputs);

interface FileLoaderProps {
	pEntityName: string;
	pDisplayNum?: number;
	pDetails?: string;
}

const FileLoader: React.FC<FileLoaderProps> = ({ pEntityName, pDisplayNum = 0, pDetails = "" }) => {
	const [entityDisplayNum, setEntityDisplayNum] = useState<number | null>(pDisplayNum);
	const [details, setDetails] = useState<string | null>(pDetails);
	const [entityName, setEntityName] = useState<string>(pEntityName);
	const justFileChoice = pEntityName && pDisplayNum > 0;
	const [file, setFile] = useState<File | null>(null);
	const [fileExists, setFileExists] = useState<boolean>(true);
	const [, setUploadedFileUrl] = useState<string | null>(null);
	const [uploadMessage, setUploadMessage] = useState<string | null>(null);

	// Keep entityName in sync with pEntityName
	useEffect(() => {
		setEntityName(pEntityName);
	}, [pEntityName]);

	const getFilePath = useCallback(() => {
		if (!file || !entityName) return "";
		return `images/${entityName}/${entityName}-${entityDisplayNum}${details ? `-${details}` : "-overview"}.jpg`;
	}, [entityName, entityDisplayNum, details, file]);

	const uploadFile = async () => {
		if (!file || entityDisplayNum === null) {
			console.error("Missing input to create the file path or file data");
			return;
		}

		const path = getFilePath();
		if (!path) {
			console.error("Generated file path is empty");
			return;
		}

		try {
			// Call the `uploadData` function to upload the file
			await uploadData({
				path,
				data: file,
				options: {
					bucket: "amplifyTeamDrive",
					contentType: file.type || "image/png",
				},
			}).result;

			// Retrieve the fully qualified URL of the uploaded file
			const url = await getUrl({ path });
			setUploadedFileUrl(url.url.href as string);
			setFileExists(true);
			setUploadMessage("File successfully uploaded - admin to process");
			console.log("File uploaded successfully:", url);
		} catch (error) {
			setFileExists(false);
			setUploadedFileUrl(null);
			setUploadMessage("Error uploading file");
			console.error("Error uploading file:", error);
		}
	};

	return (
		<div className="file-loader-container">
			{!justFileChoice && (
				<>
					<input
						type="number"
						placeholder="Display Number"
						value={entityDisplayNum || ""}
						onChange={(e) => setEntityDisplayNum(Number(e.target.value))}
						className="input-field"
					/>
					<input
						type="text"
						placeholder="Details"
						value={details || ""}
						onChange={(e) => setDetails(e.target.value)}
						className="input-field"
					/>
				</>
			)}
			<table className="file-upload-table">
				<tbody>
				<tr>
					<td className="file-upload-cell" colSpan={2}>
						<input
							type="file"
							id="file-input"
							className="input-field"
							style={{ display: "none" }} // Hide the actual file input
							onChange={(e) => {
								if (e.target.files && e.target.files.length > 0) {
									setFile(e.target.files[0]);
								}
							}}
						/>
						<button
							className="button"
							onClick={() => document.getElementById("file-input")?.click()} // Trigger the file input dialog
						>
							Choose File
						</button>
						<span className="file-name">{file ? file.name : ""}</span> {/* Show nothing if no file chosen */}
					</td>
				</tr>
				<tr>
					<td className="file-upload-cell" colSpan={2}>
						<button onClick={uploadFile} className="button">
							Upload File
						</button>
						{uploadMessage && (
							<div className={fileExists ? "file-success" : "file-error"}>{uploadMessage}</div>
						)}
					</td>
				</tr>
				</tbody>
			</table>
		</div>
	);
};

export default FileLoader;
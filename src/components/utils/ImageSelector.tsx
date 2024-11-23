//import { get } from "aws-amplify/storage";
import {  list } from 'aws-amplify/storage';
import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import outputs from '../../../amplify_outputs.json';

Amplify.configure(outputs);

interface ImageSelectorProps {
	alt?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ alt }) => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchImageUrl = async () => {
			try {
				const linkToStorageFile = await list({
					path: "images/machines/machines-1-overview.jpg",
					// Alternatively, use path: ({identityId}) => `album/${identityId}/1.jpg`
				});
				console.log('linkToStorageFile: ', linkToStorageFile);
				/*if (linkToStorageFile && linkToStorageFile.items) {
					console.log('linkToStorageFile.items: ', linkToStorageFile.items);
					linkToStorageFile.items.forEach(item => {
						console.log('item: ', item);
					});
				}*/
				//console.log('URL expires at: ', linkToStorageFile.expiresAt);
			} catch (error) {
				console.error('Error fetching image URL:', error);
				setImageUrl('');
			} finally {
				setLoading(false);
			}
		};

		fetchImageUrl();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <img src={imageUrl} alt={alt} />;
};

export default ImageSelector;
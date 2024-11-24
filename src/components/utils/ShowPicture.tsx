import styles from '@components/utils/ShowPicture.module.css'; // Import the CSS module
import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import outputs from '../../../amplify_outputs.json';

Amplify.configure(outputs);

interface ShowPictureProps {
	name: string;
	entityDisplayNum: number;
	details?: string;
	alt?: string;
}

const ShowPicture: React.FC<ShowPictureProps> = ({ name, entityDisplayNum, details, alt }) => {
	const [isClicked, setIsClicked] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [imageExists, setImageExists] = useState(true);

	const handleClick = () => {
		setIsClicked(!isClicked);
	};

	const getPicturePath = () => {
		return `images/${name}/${name}-${entityDisplayNum}${details ? `-${details}` : '-overview'}.jpg`;
	};

	useEffect(() => {
		const path = getPicturePath();
		console.log('Attempting to load image from path:', path);

		const loadImage = async () => {
			try {
				const result = await getUrl({
					path,
					options: { bucket: 'amplifyTeamDrive' }
				});

				if (result && result.url && result.url.origin) {
					setImageUrl(result.url.href);
				} else {
					throw new Error('Invalid URL result');
				}
				setImageExists(true);
			} catch (error) {
				setImageExists(false);
				console.log('Error loading image:', error);
			}
		};

		loadImage();
	}, [name, entityDisplayNum, details]);

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		setImageExists(false);
		console.log('Image load error', e);
	};

	if (!imageExists || !imageUrl) {
		console.log('Image does not exist', getPicturePath());
		return <div>Image not found</div>; // Return an alternate component if the image doesn't exist
	}

	return (
		<div>
			<img
				key={`${name}-${entityDisplayNum}`}
				src={imageUrl}
				alt={alt || 'Image'}
				className={`${styles.image} ${isClicked ? styles.large : ''}`} // Apply conditional class for click effect
				onClick={handleClick}
				onError={handleImageError}  // Using onError to manage image load error
				height="150"
				width="150"
			/>
		</div>
	);
};

export default ShowPicture;
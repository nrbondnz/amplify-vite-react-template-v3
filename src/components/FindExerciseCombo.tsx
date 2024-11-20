import { Amplify } from "aws-amplify";
import outputs from '../../amplify_outputs.json';
//import { getUrl } from 'aws-amplify/storage';

Amplify.configure(outputs);

export const FindExerciseCombo: React.FC = () => {
	return <div>FindExerciseCombo</div>;
}
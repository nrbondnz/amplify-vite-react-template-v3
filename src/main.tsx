import App from "@App";
import AppContent from "@components/AppContent";
import { SubscriptionProvider } from "@context/SubscriptionContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import outputs from '../amplify_outputs.json';
//import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Authenticator hideSignUp={false}>
            <SubscriptionProvider>
            <BrowserRouter>
            <AppContent />
                <App></App>
                </BrowserRouter>
        </SubscriptionProvider>
        </Authenticator>
    </React.StrictMode>
);
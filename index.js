/**
 * @format
 */

import {registerRootComponent} from 'expo';
import App from './App'; // Ensure this is the correct path to App.tsx

// This will ensure your app works in both Expo Go and in a native build
registerRootComponent(App);

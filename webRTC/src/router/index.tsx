import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Demo1 } from '../pages/Demo1';
import { Demo2 } from '../pages/Demo2';

export const router = createBrowserRouter([
	{
		path: '/demo1',
		element: <Demo1/>
	},
	{
		path: '/demo2',
		element: <Demo2/>
	},
	{
		path: '*',
		element: <Navigate to="/demo2"/>
	}
]);

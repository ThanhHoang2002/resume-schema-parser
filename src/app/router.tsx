import { lazy } from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import NotFoundPage from '@/components/errors/NotFoundPage';
import {MainLayout} from '@/components/layout/main-layout/MainLayout';
import {paths} from '@/config/paths';
const ResumeForm = lazy(() => import('@/app/pages/resume-form/ResumeForm'));
const ViewResumes = lazy(() => import('@/app/pages/view-resumes/ViewResumes'));

export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            element: <MainLayout />,
            children: [
                {
                    path: paths.home,
                    element: <ResumeForm />,
                },
                {
                    path: '/view-resumes',
                    element: <ViewResumes />,
                },               
            ],
            errorElement: <NotFoundPage/>,
        },
    
    ])
    return <RouterProvider router={router}/>
}
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-800">
              JSON Resume Builder
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Create Resume
              </Link>
              <Link to="/view-resumes" className="text-gray-600 hover:text-gray-900">
                View Resumes
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="mt-auto border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>JSON Resume Builder - Built with React, TypeScript & TailwindCSS</p>
          <p className="mt-2 text-sm">
            Based on the <a href="https://jsonresume.org/schema/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">JSON Resume Schema</a>
          </p>
        </div>
      </footer>
    </div>
  );
}; 
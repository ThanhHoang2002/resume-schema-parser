import { FileX } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../ui/button';

export function NotFoundPage() {
  return (
    <div className="mx-auto grid h-screen place-items-center px-8 text-center">
      <div>
        <FileX className="mx-auto h-20 w-20" />
        <h1 className="mt-10 text-3xl font-bold leading-tight md:text-4xl">
          Error 404 <br /> Page Not Found
        </h1>
        <p className="mx-auto mb-8 mt-4 max-w-md text-lg text-gray-500">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/">
          <Button className="px-6">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
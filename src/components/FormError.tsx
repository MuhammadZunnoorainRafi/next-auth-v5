import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import React from 'react';

function FormError({ message }: { message?: string }) {
  if (!message) return;
  return (
    <div className="p-3 mt-2 flex items-center gap-x-2 bg-destructive/30 text-destructive rounded-md">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}

export default FormError;

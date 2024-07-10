import { CheckCircledIcon } from '@radix-ui/react-icons';

function FormSuccess({ message }: { message?: string }) {
  if (!message) return;
  return (
    <div className="p-3 mt-2 flex items-center gap-x-2 bg-emerald-500/30 text-emerald-600 rounded-md">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}

export default FormSuccess;

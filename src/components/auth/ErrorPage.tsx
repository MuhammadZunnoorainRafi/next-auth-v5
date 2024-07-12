import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import CardWrapper from './CardWrapper';

function ErrorPage() {
  return (
    <CardWrapper
      headerLable="Oops! Something went wrong"
      backButtonHref="/auth/login"
      backButtonLable="Go back to login page?"
    >
      <div className="text-center">
        <ExclamationTriangleIcon className="w-10 h-10" />
      </div>
    </CardWrapper>
  );
}

export default ErrorPage;

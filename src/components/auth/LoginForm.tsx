import CardWrapper from './CardWrapper';

function LoginForm() {
  return (
    <CardWrapper
      headerLable="Welcome Back"
      backButtonLable="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      LoginForm
    </CardWrapper>
  );
}

export default LoginForm;

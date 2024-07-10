import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import BackButton from './BackButton';
import Header from './Header';
import Socials from './Socials';

interface CardWrapperProp {
  children: React.ReactNode;
  headerLable: string;
  backButtonLable: string;
  backButtonHref: string;
  showSocial?: boolean;
}

function CardWrapper({
  children,
  headerLable,
  backButtonLable,
  backButtonHref,
  showSocial,
}: CardWrapperProp) {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <Header label={headerLable} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{showSocial && <Socials />}</CardFooter>
      <CardFooter>
        <BackButton href={backButtonHref} lable={backButtonLable} />
      </CardFooter>
    </Card>
  );
}

export default CardWrapper;

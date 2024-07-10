import { Card, CardContent, CardHeader } from '../ui/card';
import Header from './header';
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
      {showSocial && <Socials />}
    </Card>
  );
}

export default CardWrapper;

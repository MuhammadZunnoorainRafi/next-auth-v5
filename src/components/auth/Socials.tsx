import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

function Socials() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button className="w-full" size="lg" variant="outline">
        <FcGoogle />
      </Button>
      <Button className="w-full" size="lg" variant="outline">
        <FaGithub />
      </Button>
    </div>
  );
}

export default Socials;

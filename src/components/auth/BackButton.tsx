import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface Props {
  lable: string;
  href: string;
}

function BackButton({ lable, href }: Props) {
  return (
    <Button className="w-full" variant="link" size="sm" asChild>
      <Link href={href}>{lable}</Link>
    </Button>
  );
}

export default BackButton;

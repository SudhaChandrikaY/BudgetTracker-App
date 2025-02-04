// Example usage within a Next.js page
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import React from 'react';

function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  console.log(router?.pathname);
  const gotoDash = () => {
    router.push('/dashboard');
  };

  return (
    <div className='p-5 shadow-md border-b flex items-center justify-between'>
      <div>
        {!isDashboard && <Button onClick={gotoDash}>Go to Dashboard</Button>}
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;

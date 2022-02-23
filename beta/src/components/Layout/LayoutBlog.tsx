import {MenuProvider} from 'components/useMenu';
import {Footer} from './Footer';
import {Nav} from './Nav';
import {Sidebar} from './Sidebar';

interface LayoutBlogProps {
  children: React.ReactNode;
}

export function LayoutBlog({children}: LayoutBlogProps) {
  return (
    <MenuProvider>
      <div className="flex flex-1 w-full h-full self-stretch">
        <div className="w-full min-w-0">
          <main className="flex flex-1 self-stretch flex-col items-end justify-around">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </MenuProvider>
  );
}

import Link from 'next/link';
import cn from 'classnames';

const NavItem = ({url, isActive, children}: any) => {
  return (
    <div className="flex flex-auto sm:flex-1">
      <Link
        href={url}
        className={cn(
          'active:scale-95 transition-transform w-full text-center outline-link py-1.5 px-1.5 xs:px-3 sm:px-4 rounded-full capitalize whitespace-nowrap',
          !isActive && 'hover:bg-primary/5 hover:dark:bg-primary-dark/5',
          isActive &&
            'bg-highlight dark:bg-highlight-dark text-link dark:text-link-dark'
        )}>
        {children}
      </Link>
    </div>
  );
};
export default NavItem;

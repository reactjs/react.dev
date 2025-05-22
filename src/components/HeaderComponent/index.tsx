import {Seo} from 'components/Seo';
import SocialBanner from '../SocialBanner';

interface HeaderProps {
  title: string;
  titleForTitleTag: string;
  section: string;
  routeTree: any;
  breadcrumbs: any;
  isHomePage: boolean;
  searchOrder: number | undefined;
}

const HeaderComponent = ({
  title,
  titleForTitleTag,
  section,
  isHomePage,
  searchOrder,
}: HeaderProps) => {
  return (
    <>
      <Seo
        title={title}
        titleForTitleTag={titleForTitleTag}
        isHomePage={isHomePage}
        image={`/images/og-` + section + '.png'}
        searchOrder={searchOrder}
      />
      <SocialBanner />
      {/* <TopNav section={section} routeTree={routeTree} breadcrumbs={breadcrumbs} /> */}
    </>
  );
};
export default HeaderComponent;

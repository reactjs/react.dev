import {ExternalLink} from './ExternalLink';
import {IconGitHub} from './Icon/IconGitHub';

const RepoEditLink = `https://github.com/reactjs/react.dev/blob/main/`;

type EditPageProps = {
  path: string;
  isIndexPage: boolean;
};

export const EditPage = ({path, isIndexPage}: EditPageProps) => {
  return (
    <ExternalLink
      href={
        isIndexPage
          ? `${RepoEditLink}src/content${path}/index.md`
          : `${RepoEditLink}src/content${path}.md`
      }
      className="group inline-flex text-link dark:text-link-dark justify-start items-center gap-1">
      <IconGitHub />
      <span className="group-hover:underline">Edit this page</span>
    </ExternalLink>
  );
};

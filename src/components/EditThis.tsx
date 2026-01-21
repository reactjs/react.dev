import {useRouter} from 'next/router';
import {ExternalLink} from './ExternalLink';
import {IconGitHub} from './Icon/IconGitHub';
import {ReactElement} from 'react';

const githubBranch = 'main';
const baseGithubLink = `https://github.com/reactjs/react.dev/edit/${githubBranch}/`;

type EditThisProps = {
  path: string;
  isIndexPage: boolean;
};

export const EditThis = ({path, isIndexPage}: EditThisProps): ReactElement => {
  const {asPath} = useRouter();
  const pathParts = asPath.split(/[\?\#]/)[0].split('/');
  const pageToEdit = isIndexPage ? 'index' : pathParts[pathParts.length - 1];

  return (
    <div className="flex text-link dark:text-link-dark group justify-start align-middle">
      <IconGitHub />
      <ExternalLink
        href={`${baseGithubLink}src/content${path}/${pageToEdit}.md`}>
        <span className="text-lg group-hover:underline">
          Edit this page on Github
        </span>
      </ExternalLink>
    </div>
  );
};

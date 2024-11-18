import {useRouter} from 'next/router';
import {ExternalLink} from './ExternalLink';
import {IconGitHub} from './Icon/IconGitHub';

const githubBranch = 'main';
const baseGithubLink = `https://github.com/reactjs/react.dev/edit/${githubBranch}/`;

export const EditThis = () => {
  const {asPath} = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  return (
    <div className="flex text-link dark:text-link-dark group justify-start align-middle">
      <IconGitHub />
      <ExternalLink href={`${baseGithubLink}src/content/${cleanedPath}.md`}>
        <span className="text-lg group-hover:underline">
          Edit this page on Github
        </span>
      </ExternalLink>
    </div>
  );
};

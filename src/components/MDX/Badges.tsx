import {IconCanary} from '../Icon/IconCanary';
import {IconExperimental} from 'components/Icon/IconExperimental';

export function CanaryBadge({
  title,
  isInToc = false,
}: {
  title: string;
  isInToc?: boolean;
}) {
  if (isInToc) {
    return (
      <IconCanary
        size="s"
        title={title}
        className="inline me-1 mb-0.5 text-gray-60 dark:text-gray-10"
      />
    );
  }
  return (
    <span
      title={title}
      className="text-base font-display px-1 py-0.5 font-bold bg-gray-10 dark:bg-gray-60 text-gray-60 dark:text-gray-10 rounded">
      <IconCanary
        size="s"
        className="inline me-1 mb-0.5 text-sm text-gray-60 dark:text-gray-10"
      />
      Canary only
    </span>
  );
}

export function ExperimentalBadge({
  title,
  isInToc = false,
}: {
  title: string;
  isInToc?: boolean;
}) {
  if (isInToc) {
    return (
      <IconExperimental
        size="s"
        title={title}
        className="inline me-1 mb-0.5 text-gray-60 dark:text-gray-10"
      />
    );
  }
  return (
    <span
      title={title}
      className="text-base font-display px-1 py-0.5 font-bold bg-gray-10 dark:bg-gray-60 text-gray-60 dark:text-gray-10 rounded">
      <IconExperimental
        size="s"
        className="inline me-1 mb-0.5 text-sm text-gray-60 dark:text-gray-10"
      />
      Experimental only
    </span>
  );
}

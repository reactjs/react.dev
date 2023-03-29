/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import ButtonLink from 'components/ButtonLink';
import {IconNavArrow} from 'components/Icon/IconNavArrow';

interface YouWillLearnCardProps {
  title: string;
  path: string;
  children: React.ReactNode;
}

function YouWillLearnCard({title, path, children}: YouWillLearnCardProps) {
  return (
    <div className="mt-3 flex h-full flex-col justify-between rounded-lg bg-card p-6 pb-8 shadow-inner dark:bg-card-dark xl:p-8">
      <div>
        <h4 className="text-2xl font-bold leading-tight text-primary dark:text-primary-dark">
          {title}
        </h4>
        <div className="my-4">{children}</div>
      </div>
      <div>
        <ButtonLink
          href={path}
          className="mt-1"
          type="primary"
          size="md"
          label={title}>
          Read More
          <IconNavArrow displayDirection="right" className="ml-1 inline" />
        </ButtonLink>
      </div>
    </div>
  );
}

export default YouWillLearnCard;

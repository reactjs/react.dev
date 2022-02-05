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
    <div className="flex flex-col h-full bg-card dark:bg-card-dark shadow-inner justify-between rounded-lg pb-8 p-6 xl:p-8">
      <div>
        <h4 className="text-primary dark:text-primary-dark font-bold text-2xl leading-tight">
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
          <IconNavArrow displayDirection="right" className="inline ml-1" />
        </ButtonLink>
      </div>
    </div>
  );
}

export default YouWillLearnCard;

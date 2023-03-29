/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Image from 'next/image';
import {IconTwitter} from '../Icon/IconTwitter';
import {IconGitHub} from '../Icon/IconGitHub';
import {ExternalLink} from '../ExternalLink';
import {IconNewPage} from 'components/Icon/IconNewPage';
import {H3} from './Heading';
import {IconLink} from 'components/Icon/IconLink';

interface TeamMemberProps {
  name: string;
  title: string;
  permalink: string;
  children: React.ReactNode;
  photo: string;
  twitter?: string;
  github?: string;
  personal?: string;
}

// TODO: good alt text for images/links
export function TeamMember({
  name,
  title,
  permalink,
  children,
  photo,
  github,
  twitter,
  personal,
}: TeamMemberProps) {
  if (name == null || title == null || permalink == null || children == null) {
    throw new Error(
      'Expected name, title, permalink, and children for ' + name ??
        title ??
        permalink ??
        'unknown'
    );
  }
  return (
    <div className="pb-6 sm:pb-10">
      <div className="height-auto flex flex-col sm:flex-row">
        <div
          className="relative hidden basis-2/5 overflow-hidden rounded sm:block"
          style={{width: 300, height: 250}}>
          <Image src={photo} layout="fill" objectFit="cover" alt={name} />
        </div>
        <div
          style={{minHeight: 300}}
          className="relative block w-full flex-grow basis-2/5 overflow-hidden rounded sm:hidden">
          <Image src={photo} layout="fill" objectFit="cover" alt={name} />
        </div>
        <div className="basis-3/5 items-start pl-0 sm:pl-6">
          <H3 className="mb-1 sm:my-0" id={permalink}>
            {name}
          </H3>
          {title && <div>{title}</div>}
          {children}
          <div className="sm:flex sm:flex-row">
            {twitter && (
              <div className="mr-4">
                <ExternalLink
                  aria-label="React on Twitter"
                  href={`https://twitter.com/${twitter}`}
                  className="flex flex-row items-center hover:text-primary dark:text-primary-dark">
                  <IconTwitter className="pr-2" />
                  {twitter}
                </ExternalLink>
              </div>
            )}
            {github && (
              <div className="mr-4">
                <ExternalLink
                  aria-label="GitHub Profile"
                  href={`https://github.com/${github}`}
                  className="flex flex-row items-center hover:text-primary dark:text-primary-dark">
                  <IconGitHub className="pr-2" /> {github}
                </ExternalLink>
              </div>
            )}
            {personal && (
              <ExternalLink
                aria-label="Personal Site"
                href={`https://${personal}`}
                className="flex flex-row items-center hover:text-primary dark:text-primary-dark">
                <IconLink className="pr-2" /> {personal}
              </ExternalLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

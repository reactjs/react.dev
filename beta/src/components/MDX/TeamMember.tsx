/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Image from 'next/image';
import {IconTwitter} from '../Icon/IconTwitter';
import {IconGitHub} from '../Icon/IconGitHub';
import {ExternalLink} from '../ExternalLink';

interface TeamMemberProps {
  name: string;
  children: React.ReactNode;
  photo: string;
  twitter?: string;
  github?: string;
  personal?: string;
}

// TODO: good alt text for images/links
export function TeamMember({
  children,
  photo,
  github,
  twitter,
  personal,
}: TeamMemberProps) {
  return (
    <div className="flex flex-col sm:flex-row height-auto">
      <div
        className="hidden sm:block basis-2/5 rounded overflow-hidden relative"
        style={{width: 300, height: 250}}>
        <Image src={photo} layout="fill" objectFit="cover" alt="TODO" />
      </div>
      <div
        style={{minHeight: 300}}
        className="block w-full sm:hidden flex-grow basis-2/5 rounded overflow-hidden relative">
        <Image src={photo} layout="fill" objectFit="cover" alt="TODO" />
      </div>
      <div className="pl-0 sm:pl-6 basis-3/5 items-start">
        {children}
        <div className="flex flex-row">
          <div className="mr-4">
            <ExternalLink
              aria-label="React on Twitter"
              href={`https://twitter.com/${twitter}`}
              className="hover:text-primary dark:text-primary-dark flex flex-row items-center">
              <IconTwitter />
              {twitter}
            </ExternalLink>
          </div>
          <div className="mr-4">
            <ExternalLink
              aria-label="React on Twitter"
              href={`https://twitter.com/${github}`}
              className="hover:text-primary dark:text-primary-dark flex flex-row items-center">
              <IconGitHub /> {github}
            </ExternalLink>
          </div>
          {personal && (
            <ExternalLink
              aria-label="React on Twitter"
              href={`https://${personal}`}
              className="hover:text-primary dark:text-primary-dark flex flex-row items-center">
              {personal}
            </ExternalLink>
          )}
        </div>
      </div>
    </div>
  );
}

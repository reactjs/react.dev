import React from 'react';
import {IconNewPage} from '../Icon/IconNewPage';
import ButtonLink from 'components/ButtonLink';

export function CareerApply({
  href,
  roleType,
}: {
  roleType: string;
  href: string;
}) {
  return (
    <>
      <section className="p-8 mt-12 mb-16 flex flex-row shadow-inner-border dark:shadow-inner-border-dark justify-between items-center bg-card dark:bg-card-dark rounded-2xl">
        <div className="flex-col">
          <h2 className="text-primary font-display dark:text-primary-dark font-bold text-2xl leading-tight">
            Apply for This Role
          </h2>
          <p className="whitespace-pre-wrap my-4">
            The button below will take you to a generic {roleType} job posting
            on Meta Careers. After you apply to the role and are connected with
            a recruiter, let them know you are interested in the React
            Team&apos;s role.
          </p>

          <ButtonLink
            className="mt-1"
            label="Read More"
            href={href}
            type="primary">
            Apply on Meta Careers
            <IconNewPage className="inline ms-2" />
          </ButtonLink>
        </div>
      </section>
      <hr className="border-border dark:border-border-dark mb-14" />
    </>
  );
}

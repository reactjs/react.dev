'use client';

import {useEffect, useState} from 'react';
import cn from 'classnames';
import {IconChevron} from '../Icon/IconChevron';
import {IconDeepDive} from '../Icon/IconDeepDive';
import {IconCodeBlock} from '../Icon/IconCodeBlock';
import {Button} from '../Button';
import {H4} from './Heading';

export function ExpandableExampleClient({
  children,
  excerpt,
  id,
  title,
  type,
}: {
  children: React.ReactNode;
  excerpt?: string;
  id: string;
  title: React.ReactNode;
  type: 'DeepDive' | 'Example';
}) {
  const isDeepDive = type === 'DeepDive';
  const isExample = type === 'Example';
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (id === window.location.hash.slice(1)) {
      setIsExpanded(true);
    }
  }, [id]);

  return (
    <details
      open={isExpanded}
      onToggle={(event) => setIsExpanded(event.currentTarget.open)}
      className={cn(
        'my-12 rounded-2xl shadow-inner-border dark:shadow-inner-border-dark relative',
        {
          'dark:bg-opacity-20 dark:bg-purple-60 bg-purple-5': isDeepDive,
          'dark:bg-opacity-20 dark:bg-yellow-60 bg-yellow-5': isExample,
        }
      )}>
      <summary
        className="list-none p-8"
        tabIndex={-1}
        onClick={(event) => {
          if (!(event.target instanceof SVGElement)) {
            event.preventDefault();
          }
        }}>
        <h5
          className={cn('mb-4 uppercase font-bold flex items-center text-sm', {
            'dark:text-purple-30 text-purple-50': isDeepDive,
            'dark:text-yellow-30 text-yellow-60': isExample,
          })}>
          {isDeepDive && (
            <>
              <IconDeepDive className="inline me-2 dark:text-purple-30 text-purple-40" />
              Deep Dive
            </>
          )}
          {isExample && (
            <>
              <IconCodeBlock className="inline me-2 dark:text-yellow-30 text-yellow-50" />
              Example
            </>
          )}
        </h5>
        <div className="mb-4">
          <H4
            id={id}
            className="text-xl font-bold text-primary dark:text-primary-dark">
            {title}
          </H4>
          {excerpt && <div>{excerpt}</div>}
        </div>
        <Button
          active
          className={cn({
            'bg-purple-50 border-purple-50 hover:bg-purple-40 focus:bg-purple-50 active:bg-purple-50':
              isDeepDive,
            'bg-yellow-50 border-yellow-50 hover:bg-yellow-40 focus:bg-yellow-50 active:bg-yellow-50':
              isExample,
          })}
          onClick={() => setIsExpanded((current) => !current)}>
          <span className="me-1">
            <IconChevron displayDirection={isExpanded ? 'up' : 'down'} />
          </span>
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </Button>
      </summary>
      <div
        className={cn('p-8 border-t', {
          'dark:border-purple-60 border-purple-10 ': isDeepDive,
          'dark:border-yellow-60 border-yellow-50': isExample,
        })}>
        {children}
      </div>
    </details>
  );
}

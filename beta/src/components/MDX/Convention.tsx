/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {H3} from './Heading';

interface ConventionProps {
  children: React.ReactNode;
  name: string;
}

function Convention({children, name}: ConventionProps) {
  const id = name ? `${name}-conventions` : 'conventions';
  return (
    <section className="my-12">
      <H3 id={id} className="text-2xl leading-9">
        Conventions
      </H3>
      {children}
    </section>
  );
}

export default Convention;

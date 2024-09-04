import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopNav } from '../TopNav';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the NextLink component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('TopNav', () => {
  it('navigates to /learn page when Learn is clicked', () => {
    render(<TopNav />);
    const learnLink = screen.getByRole('link', { name: /learn/i });
    expect(learnLink).toHaveAttribute('href', '/learn');
  });

  it('navigates to /reference/react page when Reference is clicked', () => {
    render(<TopNav />);
    const referenceLink = screen.getByRole('link', { name: /reference/i });
    expect(referenceLink).toHaveAttribute('href', '/reference/react');
  });

  it('navigates to /community page when Community is clicked', () => {
    render(<TopNav />);
    const communityLink = screen.getByRole('link', { name: /community/i });
    expect(communityLink).toHaveAttribute('href', '/community');
  });

  it('navigates to /blog page when Blog is clicked', () => {
    render(<TopNav />);
    const blogLink = screen.getByRole('link', { name: /blog/i });
    expect(blogLink).toHaveAttribute('href', '/blog');
  });
});
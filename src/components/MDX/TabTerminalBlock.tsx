/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useState, useEffect, useCallback} from 'react';
import TerminalBlock from './TerminalBlock';
import {IconTerminal} from '../Icon/IconTerminal';

type TabOption = {
  label: string;
  value: string;
  content: string;
};

// Define this outside of any conditionals for SSR compatibility
const STORAGE_KEY = 'react-terminal-tabs';

// Map key for active tab preferences - only used on client
let activeTabsByKey: Record<string, string> = {};
let subscribersByKey: Record<string, Set<(tab: string) => void>> = {};

function saveToLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTabsByKey));
    } catch (e) {
      // Ignore errors
    }
  }
}

function getSubscribers(key: string): Set<(tab: string) => void> {
  if (!subscribersByKey[key]) {
    subscribersByKey[key] = new Set();
  }
  return subscribersByKey[key];
}

function setActiveTab(key: string, tab: string) {
  activeTabsByKey[key] = tab;
  saveToLocalStorage();

  const subscribers = getSubscribers(key);
  subscribers.forEach((callback) => callback(tab));
}

function useTabState(
  key: string,
  defaultTab: string
): [string, (tab: string) => void] {
  // Start with the default tab for SSR
  const [activeTab, setLocalActiveTab] = useState(defaultTab);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage after mount
  useEffect(() => {
    // Read from localStorage
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed && typeof parsed === 'object') {
          Object.assign(activeTabsByKey, parsed);
        }
      }
    } catch (e) {
      // Ignore errors
    }

    // Set up storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            Object.assign(activeTabsByKey, parsed);

            Object.entries(parsed).forEach(([k, value]) => {
              const subscribers = subscribersByKey[k];
              if (subscribers) {
                subscribers.forEach((callback) => callback(value as string));
              }
            });
          }
        } catch (e) {
          // Ignore errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Now get the value from localStorage or keep using default
    const storedValue = activeTabsByKey[key] || defaultTab;
    setLocalActiveTab(storedValue);
    setInitialized(true);

    // Make sure this key is in our global store
    if (!activeTabsByKey[key]) {
      activeTabsByKey[key] = defaultTab;
      saveToLocalStorage();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, defaultTab]);

  // Set up subscription effect
  useEffect(() => {
    // Skip if not yet initialized
    if (!initialized) return;

    const onTabChange = (newTab: string) => {
      setLocalActiveTab(newTab);
    };

    const subscribers = getSubscribers(key);
    subscribers.add(onTabChange);

    return () => {
      subscribers.delete(onTabChange);

      if (subscribers.size === 0) {
        delete subscribersByKey[key];
      }
    };
  }, [key, initialized]);

  // Create a stable setter function
  const setTab = useCallback(
    (newTab: string) => {
      setActiveTab(key, newTab);
    },
    [key]
  );

  return [activeTab, setTab];
}

interface TabTerminalBlockProps {
  /** Terminal's message level: info, warning, or error */
  level?: 'info' | 'warning' | 'error';

  /**
   * Tab options, each with a label, value, and content.
   * Example: [
   *   { label: 'npm', value: 'npm', content: 'npm install react' },
   *   { label: 'Bun', value: 'bun', content: 'bun install react' }
   * ]
   */
  tabs?: Array<TabOption>;

  /** Optional initial active tab value */
  defaultTab?: string;

  /**
   * Optional storage key for tab state.
   * All TabTerminalBlocks with the same key will share tab selection.
   */
  storageKey?: string;
}

/**
 * TabTerminalBlock displays a terminal block with tabs.
 * Tabs sync across instances with the same storageKey.
 *
 * @example
 * <TabTerminalBlock
 *   tabs={[
 *     { label: 'npm', value: 'npm', content: 'npm install react' },
 *     { label: 'Bun', value: 'bun', content: 'bun install react' }
 *   ]}
 * />
 */
function TabTerminalBlock({
  level = 'info',
  tabs = [],
  defaultTab,
  storageKey = 'package-manager',
}: TabTerminalBlockProps) {
  // Create a fallback tab if none provided
  const safeTabsList =
    tabs && tabs.length > 0
      ? tabs
      : [{label: 'Terminal', value: 'default', content: 'No content provided'}];

  // Always use the first tab as initial defaultTab for SSR consistency
  // This ensures server and client render the same content initially
  const initialDefaultTab = defaultTab || safeTabsList[0].value;

  // Set up tab state
  const [activeTab, setTabValue] = useTabState(storageKey, initialDefaultTab);

  const handleTabClick = useCallback(
    (tabValue: string) => {
      return () => setTabValue(tabValue);
    },
    [setTabValue]
  );

  // Handle the case with no content - after hooks have been called
  if (
    safeTabsList.length === 0 ||
    safeTabsList[0].content === 'No content provided'
  ) {
    return (
      <TerminalBlock level="error">
        Error: No tab content provided
      </TerminalBlock>
    );
  }

  const activeTabOption =
    safeTabsList.find((tab) => tab.value === activeTab) || safeTabsList[0];

  const customHeader = (
    <div className="flex items-center">
      <IconTerminal className="mr-3" />
      <div className="flex items-center">
        {safeTabsList.map((tab) => (
          <button
            key={tab.value}
            className={`text-sm font-medium px-3 py-1 h-7 mx-0.5 inline-flex items-center justify-center rounded-sm transition-colors ${
              activeTab === tab.value
                ? 'bg-gray-50/50 text-primary dark:bg-gray-800/30 dark:text-primary-dark'
                : 'text-primary dark:text-primary-dark hover:bg-gray-50/30 dark:hover:bg-gray-800/20'
            }`}
            onClick={handleTabClick(tab.value)}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <TerminalBlock level={level} customHeader={customHeader}>
      {activeTabOption.content}
    </TerminalBlock>
  );
}

export default TabTerminalBlock;

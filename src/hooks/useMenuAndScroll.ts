import {useState, useEffect, useRef, useCallback, startTransition} from 'react';
import {useRouter} from 'next/router';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';
import {RouteItem} from 'components/Layout/getRouteMeta';

const useMenuAndScroll = (routeTree: RouteItem) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const {asPath} = useRouter();
  const scrollDetectorRef = useRef(null);

  if ((routeTree as any).routes.length === 1) {
    routeTree = (routeTree as any).routes[0];
  }

  useEffect(() => {
    if (isMenuOpen) {
      const preferredScrollParent = scrollParentRef.current!;
      disableBodyScroll(preferredScrollParent);
      return () => enableBodyScroll(preferredScrollParent);
    } else {
      return undefined;
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [asPath]);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: 1023px)`);

    function closeIfNeeded() {
      if (!media.matches) {
        setIsMenuOpen(false);
      }
    }

    closeIfNeeded();
    media.addEventListener('change', closeIfNeeded);
    return () => {
      media.removeEventListener('change', closeIfNeeded);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsScrolled(!entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: `0px 0px`,
        threshold: 0,
      }
    );
    observer.observe(scrollDetectorRef.current!);
    return () => observer.disconnect();
  }, []);

  const onOpenSearch = useCallback(() => {
    startTransition(() => {
      setShowSearch(true);
    });
  }, []);

  const onCloseSearch = useCallback(() => {
    setShowSearch(false);
  }, []);

  return {
    isMenuOpen,
    setIsMenuOpen,
    showSearch,
    setShowSearch,
    isScrolled,
    scrollParentRef,
    scrollDetectorRef,
    onOpenSearch,
    onCloseSearch,
  };
};
export default useMenuAndScroll;

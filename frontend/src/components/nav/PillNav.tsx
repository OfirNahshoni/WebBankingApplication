import React, { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './PillNav.css';

gsap.registerPlugin(useGSAP);

export interface PillItem { label: string; href: string; ariaLabel?: string; icon?: React.ReactNode }

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  activePillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
  rightSlot?: React.ReactNode; // Sign out button slot
}

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  activePillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
  rightSlot

}: PillNavProps) => {
  const { pathname } = useLocation();
  const resolvedActive = activeHref ?? pathname;
  const resolvedPillTextColor = pillTextColor ?? '#ffffff';
  const resolvedActiveTextColor = activePillTextColor ?? '#060010';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<HTMLSpanElement[]>([]);
  const tlRefs = useRef<gsap.core.Timeline[]>([]);
  const activeTweenRefs = useRef<gsap.core.Tween[]>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLSpanElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector('.pill-label') as HTMLElement | null;
        const white = pill.querySelector('.pill-label-hover') as HTMLElement | null;

        if (label) gsap.set(label, { y: 0 });

        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);

        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    const menu = mobileMenuRef.current;

    if (menu) gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItems = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, { scale: 1, duration: 0.6, ease });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, { width: 'auto', duration: 0.6, ease });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];

    if (!tl) return;

    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];

    if (!tl) return;

    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    const menu = mobileMenuRef.current;

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu, { opacity: 0, y: 10, scaleY: 1 }, { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease });
      } else {
        gsap.to(menu, {
          opacity: 0, y: 10, scaleY: 1, duration: 0.2, ease,
          onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); }
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#');

  const isRouterLink = (href: string) => href && !isExternalLink(href);

  const cssVars = useMemo(() => ({
    ['--base' as any]: baseColor,
    ['--pill-bg' as any]: pillColor,
    ['--hover-text' as any]: hoveredPillTextColor,
    ['--pill-text' as any]: resolvedPillTextColor,
    ['--pill-active-text' as any]: resolvedActiveTextColor,
    ['--hamburger-color' as any]: '#123aaa'
  }), [baseColor, hoveredPillTextColor, pillColor, resolvedActiveTextColor, resolvedPillTextColor]);

  const renderWithIcon = (icon: React.ReactNode, label: React.ReactNode) => (
    <span className="pill-content">
      {icon ? <span className="pill-icon" aria-hidden="true">{icon}</span> : null}
      {label}
    </span>
  );

  const renderRightSlotForMobile = () => {
    if (!rightSlot) return null;

    if (isValidElement(rightSlot)) {
      const element = rightSlot as React.ReactElement<any>;
      const existingClassName = (element.props?.className as string) ?? '';
      const nextProps: Record<string, unknown> = {
        className: `${existingClassName} mobile-menu-signout`.trim(),
      };

      if (element.props?.block === undefined) {
        nextProps.block = true;
      }

      return cloneElement(element, nextProps);
    }

    return rightSlot;
  };

  const mobileSlotContent = renderRightSlotForMobile();

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        <Link
          className="pill-logo"
          to={items?.[0]?.href || '/dashboard'}
          aria-label="Home"
          ref={(el) => { logoRef.current = el; }}
        >
          <img src={logo} alt={logoAlt} ref={logoImgRef} />
        </Link>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href} role="none">
                {isRouterLink(item.href) ? (
                  <Link
                    role="menuitem"
                    to={item.href}
                    className={`pill${resolvedActive === item.href ? ' is-active' : ''}`}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    tabIndex={0}
                  >
                    <span className="hover-circle" ref={(el) => { if (el) circleRefs.current[i] = el; }} />

                    {renderWithIcon(
                      item.icon,
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                    </span>
                    )}
                  </Link>
                ) : (
                  <a role="menuitem" href={item.href} className={`pill${resolvedActive === item.href ? ' is-active' : ''}`}>
                    <span className="hover-circle" ref={(el) => { if (el) circleRefs.current[i] = el; }} />

                    {renderWithIcon(
                      item.icon,
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                    </span>
                    )}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="desktop-only pill-nav-actions" style={{ marginLeft: 12 }}>{rightSlot}</div>

        <button className="mobile-menu-button mobile-only" onClick={toggleMobileMenu} aria-label="Toggle menu" ref={hamburgerRef}>
          <span className="hamburger-line" /><span className="hamburger-line" /><span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {items.map((item) => (
            <li key={`mobile-${item.href}`}>
              <Link to={item.href} className={`mobile-menu-link${resolvedActive === item.href ? ' is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                {renderWithIcon(item.icon, <span className="mobile-menu-label">{item.label}</span>)}
              </Link>
            </li>
          ))}
        </ul>
        {mobileSlotContent ? (
          <div className="mobile-menu-actions">
            {mobileSlotContent}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PillNav;

import React, { useState } from "react";
import { cn, Separator, Tabs, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ThemeMode, useThemeMode } from "../context/GalleryContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";

const INDICATOR_CLASS = "rounded-full bg-surface shadow-xs";
const ICON_CLASS = "w-4 h-4 shrink-0";

const THEME_TABS = [
  { id: "auto" as ThemeMode,  icon: "gravity-ui:display", ariaLabel: "Auto (system) mode", desktop: "Use System Theme", mobile: "System" },
  { id: "light" as ThemeMode, icon: "gravity-ui:sun",     ariaLabel: "Light mode",          desktop: "Light Mode",       mobile: "Light"  },
  { id: "dark" as ThemeMode,  icon: "gravity-ui:moon",    ariaLabel: "Dark mode",           desktop: "Dark Mode",        mobile: "Dark"   },
] as const;

const VIEW_TABS = [
  { id: "gallery",  label: "Gallery",  icon: "gravity-ui:layout-cells-large" },
  { id: "lightbox", label: "Lightbox", icon: "gravity-ui:filmstrip" },
] as const;

function ViewModeTabs({ mobile, onAfterChange }: { mobile?: boolean; onAfterChange?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLightbox = location.pathname === "/gallery/lightbox";

  const tabClass = mobile
    ? "flex-1 flex items-center justify-center gap-1.5 h-8 px-4 text-sm font-medium text-muted cursor-pointer rounded-full transition-colors"
    : "flex items-center gap-1.5 px-3.5 h-7 text-sm font-medium text-muted cursor-pointer rounded-full transition-colors";

  return (
    <Tabs
      selectedKey={isLightbox ? "lightbox" : "gallery"}
      onSelectionChange={(key) => {
        navigate(key === "lightbox" ? "/gallery/lightbox" : "/gallery");
        onAfterChange?.();
      }}
    >
      <Tabs.ListContainer
        className={cn(
          "rounded-full bg-default-100 dark:bg-default-50/10 p-0.5 border border-separator/50",
          mobile && "w-full"
        )}
      >
        <Tabs.List
          aria-label="View Mode"
          className={cn("flex items-center p-0", mobile && "w-full")}
        >
          {VIEW_TABS.map(({ id, label, icon }) => (
            <Tabs.Tab key={id} id={id} className={tabClass}>
              <Icon icon={icon} className={ICON_CLASS} />
              <span>{label}</span>
              <Tabs.Indicator className={INDICATOR_CLASS} />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

function ThemeToggleTabs({ mobile }: { mobile?: boolean }) {
  const [themeMode, setThemeMode] = useThemeMode();
  const btnSizeClass = mobile ? "w-8 h-8" : "w-7 h-7";

  return (
    <Tabs
      selectedKey={themeMode}
      onSelectionChange={(key) => setThemeMode(key as ThemeMode)}
    >
      <Tabs.ListContainer className="rounded-full bg-default-100 dark:bg-default-50/10 p-0.5 border border-separator/50">
        <Tabs.List aria-label="Color Theme" className="flex items-center p-0">
          {THEME_TABS.map(({ id, icon, ariaLabel, desktop, mobile: mobileLabel }) => (
            <Tabs.Tab
              key={id}
              id={id}
              aria-label={ariaLabel}
              className={`flex items-center justify-center ${btnSizeClass} shrink-0 p-0 text-muted cursor-pointer rounded-full transition-colors`}
            >
              <Tooltip delay={200}>
                <Tooltip.Trigger className="w-full h-full flex items-center justify-center">
                  <Icon icon={icon} className={ICON_CLASS} />
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{mobile ? mobileLabel : desktop}</p>
                </Tooltip.Content>
              </Tooltip>
              <Tabs.Indicator className={INDICATOR_CLASS} />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/80 backdrop-blur-md">
      <header className="flex h-14 items-center justify-between px-6">
        {/* Left Branding */}
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => navigate("/gallery")}
        >
          <img src="/suisai.svg" className="h-8 w-8" alt="Suisai Logo" />
          <span className="ml-2.5 text-2xl font-semibold tracking-tight text-foreground font-sans">
            suisai
          </span>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <ViewModeTabs />
          <Separator orientation="vertical" />
          <ThemeToggleTabs />
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-muted hover:text-foreground p-1 cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-separator bg-background/95 p-4 md:hidden flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted font-semibold uppercase tracking-wider">View</span>
            <ViewModeTabs mobile onAfterChange={() => setIsMenuOpen(false)} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-semibold uppercase tracking-wider">Theme</span>
            <ThemeToggleTabs mobile />
          </div>
        </div>
      )}
    </nav>
  );
}

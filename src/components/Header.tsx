import React, {useState} from "react";
import {Separator, Tabs, Tooltip} from "@heroui/react";
import {Icon} from "@iconify/react";
import {ThemeMode, useThemeMode} from "../context/GalleryContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useThemeMode();

  const location = useLocation();
  const navigate = useNavigate();

  const isLightbox = location.pathname === "/gallery/lightbox";

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
          {/* Gallery / Lightbox Pill Tabs */}
          <Tabs
            selectedKey={isLightbox ? "lightbox" : "gallery"}
            onSelectionChange={(key) => {
              if (key === "lightbox") navigate("/gallery/lightbox");
              else navigate("/gallery");
            }}
          >
            <Tabs.ListContainer className="rounded-full bg-default-100 dark:bg-default-50/10 p-0.5 border border-separator/50">
              <Tabs.List aria-label="View Mode" className="flex items-center p-0">
                <Tabs.Tab
                  id="gallery"
                  className="flex items-center gap-1.5 px-3.5 h-7 text-sm font-medium text-muted cursor-pointer rounded-full transition-colors"
                >
                  <Icon icon="gravity-ui:layout-cells-large" className="w-4 h-4 shrink-0" />
                  <span>Gallery</span>
                  <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                </Tabs.Tab>
                <Tabs.Tab
                  id="lightbox"
                  className="flex items-center gap-1.5 px-3.5 h-7 text-sm font-medium text-muted cursor-pointer rounded-full transition-colors"
                >
                  <Icon icon="gravity-ui:filmstrip" className="w-4 h-4 shrink-0" />
                  <span>Lightbox</span>
                  <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>

          <Separator orientation="vertical" />

          {/* Dark Mode Toggles */}
          <Tabs
            selectedKey={themeMode}
            onSelectionChange={(key) => setThemeMode(key as ThemeMode)}
          >
            <Tabs.ListContainer className="rounded-full bg-default-100 dark:bg-default-50/10 p-0.5 border border-separator/50">
              <Tabs.List aria-label="Color Theme" className="flex items-center p-0">
                <Tabs.Tab
                  id="auto"
                  aria-label="Auto (system) mode"
                  className="flex items-center justify-center w-7 h-7 shrink-0 p-0 text-muted cursor-pointer rounded-full transition-colors"
                >
                  <Tooltip delay={200}>
                    <Tooltip.Trigger className="w-full h-full flex items-center justify-center">
                      <Icon icon="gravity-ui:display" className="w-4 h-4 shrink-0" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Use System Theme</p>
                    </Tooltip.Content>
                  </Tooltip>
                  <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                </Tabs.Tab>
                <Tabs.Tab
                  id="light"
                  aria-label="Light mode"
                  className="flex items-center justify-center w-7 h-7 shrink-0 p-0 text-muted cursor-pointer rounded-full transition-colors"
                >
                  <Tooltip delay={200}>
                    <Tooltip.Trigger className="w-full h-full flex items-center justify-center">
                      <Icon icon="gravity-ui:sun" className="w-4 h-4 shrink-0" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Light Mode</p>
                    </Tooltip.Content>
                  </Tooltip>
                  <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                </Tabs.Tab>
                <Tabs.Tab
                  id="dark"
                  aria-label="Dark mode"
                  className="flex items-center justify-center w-7 h-7 shrink-0 p-0 text-muted cursor-pointer rounded-full transition-colors"
                >
                  <Tooltip delay={200}>
                    <Tooltip.Trigger className="w-full h-full flex items-center justify-center">
                      <Icon icon="gravity-ui:moon" className="w-4 h-4 shrink-0" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Dark Mode</p>
                    </Tooltip.Content>
                  </Tooltip>
                  <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
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
            <Tabs
              selectedKey={isLightbox ? "lightbox" : "gallery"}
              onSelectionChange={(key) => {
                if (key === "lightbox") navigate("/gallery/lightbox");
                else navigate("/gallery");
                setIsMenuOpen(false);
              }}
            >
              <Tabs.ListContainer className="rounded-full bg-default-100 dark:bg-default-50/10 p-0.5 w-full border border-separator/50">
                <Tabs.List aria-label="View Mode" className="flex items-center w-full p-0">
                  <Tabs.Tab
                    id="gallery"
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 px-4 text-sm font-medium text-muted cursor-pointer rounded-full transition-colors"
                  >
                    <Icon icon="gravity-ui:layout-cells-large" className="w-4 h-4 shrink-0" />
                    <span>Gallery</span>
                    <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                  </Tabs.Tab>
                  <Tabs.Tab
                    id="lightbox"
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 px-4 text-sm font-medium text-muted cursor-pointer rounded-full transition-colors"
                  >
                    <Icon icon="gravity-ui:filmstrip" className="w-4 h-4 shrink-0" />
                    <span>Lightbox</span>
                    <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-semibold uppercase tracking-wider">Theme</span>
            <Tabs
              selectedKey={themeMode}
              onSelectionChange={(key) => {
                setThemeMode(key as ThemeMode);
              }}
            >
              <Tabs.ListContainer className="rounded-full bg-default-100 dark:bg-default-50/10 p-0.5 border border-separator/50">
                <Tabs.List aria-label="Color Theme" className="flex items-center p-0">
                  <Tabs.Tab
                    id="auto"
                    aria-label="Auto (system) mode"
                    className="flex items-center justify-center w-8 h-8 shrink-0 p-0 data-[selected=true]:text-foreground cursor-pointer rounded-full transition-colors"
                  >
                    <Tooltip delay={200}>
                      <Tooltip.Trigger className="w-full h-full flex items-center justify-center">
                        <Icon icon="gravity-ui:display" className="w-4 h-4 shrink-0" />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>System</p>
                      </Tooltip.Content>
                    </Tooltip>
                    <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                  </Tabs.Tab>
                  <Tabs.Tab
                    id="light"
                    aria-label="Light mode"
                    className="flex items-center justify-center w-8 h-8 shrink-0 p-0 text-muted cursor-pointer rounded-full transition-colors"
                  >
                    <Tooltip delay={200}>
                      <Tooltip.Trigger className="w-full h-full flex items-center justify-center">
                        <Icon icon="gravity-ui:sun" className="w-4 h-4 shrink-0" />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>Light</p>
                      </Tooltip.Content>
                    </Tooltip>
                    <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                  </Tabs.Tab>
                  <Tabs.Tab
                    id="dark"
                    aria-label="Dark mode"
                    className="flex items-center justify-center w-8 h-8 shrink-0 p-0 data-[selected=true]:text-foreground cursor-pointer rounded-full transition-colors"
                  >
                    <Tooltip delay={200}>
                      <Tooltip.Trigger className="w-full h-full flex items-center justify-center">
                        <Icon icon="gravity-ui:moon" className="w-4 h-4 shrink-0" />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>Dark</p>
                      </Tooltip.Content>
                    </Tooltip>
                    <Tabs.Indicator className="rounded-full bg-surface shadow-xs" />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;

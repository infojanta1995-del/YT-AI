import React from 'react';
import { Menu, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';
import { NAVIGATION_ITEMS, type NavigationPageId } from '../../navigation.ts';
import { useTheme } from '../../theme/ThemeContext.tsx';

interface TopBarProps {
  activePage: NavigationPageId;
  onOpenMobileDrawer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activePage, onOpenMobileDrawer }) => {
  const { resolvedMode, toggleMode, currentPresetDef } = useTheme();
  const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activePage) || NAVIGATION_ITEMS[0];

  return (
    <header
      className="h-16 border-b px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Left: Mobile Menu Button & Breadcrumb */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileDrawer}
          className="md:hidden p-2 rounded-xl border text-xs cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span>Workspace</span>
            <span>/</span>
            <span style={{ color: 'var(--accent-primary)' }}>{currentItem.label}</span>
          </div>
          <h1 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {currentItem.label}
          </h1>
        </div>
      </div>

      {/* Right Controls: Model Badge, Theme Preset indicator, Theme toggle */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Model Lock Badge */}
        <div
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }} />
          <span>gemini-3.8-flash</span>
        </div>

        {/* Preset Name Pill */}
        <div
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--accent-primary)',
          }}
        >
          <Sparkles className="w-3 h-3" />
          <span>{currentPresetDef.name}</span>
        </div>

        {/* Dark/Light Quick Toggle */}
        <button
          onClick={toggleMode}
          title={`Switch to ${resolvedMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl border text-xs transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Toggle theme mode"
        >
          {resolvedMode === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>
      </div>
    </header>
  );
};

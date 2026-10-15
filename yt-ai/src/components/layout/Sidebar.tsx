import React from 'react';
import { type User } from 'firebase/auth';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
} from 'lucide-react';
import { NAVIGATION_ITEMS, type NavigationPageId } from '../../navigation.ts';
import { useTheme } from '../../theme/ThemeContext.tsx';

interface SidebarProps {
  user: User;
  activePage: NavigationPageId;
  onSelectPage: (id: NavigationPageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
  signingOut: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activePage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
  onSignOut,
  signingOut,
}) => {
  const { resolvedMode, toggleMode } = useTheme();

  return (
    <aside
      className={`hidden md:flex flex-col border-r transition-all duration-300 z-30 select-none relative backdrop-blur-xl h-screen sticky top-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Sidebar Header / Logo */}
      <div
        className="h-16 flex items-center px-4 border-b justify-between"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div
            className="h-10 w-10 min-w-10 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-xs font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                Workspace Portal
              </h1>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                AI Studio & Drive Hub
              </p>
            </div>
          )}
        </div>

        {/* Collapse / Expand toggle */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg border text-xs transition-colors hover:bg-slate-800/20 cursor-pointer"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items (Scrollable) */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  collapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 space-x-3'
                } ${isActive ? 'shadow-md' : 'hover:bg-slate-800/10'}`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                }}
              >
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: isActive ? '#ffffff' : 'var(--text-muted)' }}
                />

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--accent-subtle)',
                          color: isActive ? '#ffffff' : 'var(--accent-text)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Tooltip on Collapsed State */}
              {collapsed && (
                <div
                  className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xl border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer: Theme Toggle & User Info */}
      <div
        className="p-3 border-t space-y-2"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {/* Quick Dark/Light Switch */}
        <button
          onClick={toggleMode}
          title={`Switch to ${resolvedMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          className={`w-full flex items-center rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-2.5'
          }`}
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          {resolvedMode === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          )}
          {!collapsed && (
            <span>{resolvedMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>

        {/* User Card & Sign Out */}
        <div
          className={`rounded-xl border p-2 flex items-center ${
            collapsed ? 'justify-center' : 'justify-between space-x-2'
          }`}
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center space-x-2.5 overflow-hidden">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border"
                style={{ borderColor: 'var(--border-subtle)' }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border"
                style={{
                  backgroundColor: 'var(--accent-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent-primary)',
                }}
              >
                <UserIcon className="w-4 h-4" />
              </div>
            )}

            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user.displayName || 'Google Account'}
                </div>
                <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {user.email}
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={onSignOut}
              disabled={signingOut}
              title="Sign Out"
              className="p-1.5 rounded-lg border text-xs hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer flex-shrink-0"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

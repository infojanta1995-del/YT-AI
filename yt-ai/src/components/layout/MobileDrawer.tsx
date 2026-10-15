import React from 'react';
import { type User } from 'firebase/auth';
import {
  ShieldCheck,
  X,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
} from 'lucide-react';
import { NAVIGATION_ITEMS, type NavigationPageId } from '../../navigation.ts';
import { useTheme } from '../../theme/ThemeContext.tsx';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  activePage: NavigationPageId;
  onSelectPage: (id: NavigationPageId) => void;
  onSignOut: () => void;
  signingOut: boolean;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  activePage,
  onSelectPage,
  onSignOut,
  signingOut,
}) => {
  const { resolvedMode, toggleMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div
        className="relative w-72 max-w-[85vw] h-full flex flex-col shadow-2xl border-r z-10 animate-in slide-in-from-left duration-200"
        style={{
          backgroundColor: 'var(--bg-base)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* Drawer Header */}
        <div
          className="h-16 flex items-center px-4 border-b justify-between"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                Workspace Portal
              </h2>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                AI Studio & Drive Hub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border text-xs"
            style={{
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onClose();
                }}
                className={`w-full flex items-center px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'shadow-md' : 'hover:bg-slate-800/10'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                }}
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: isActive ? '#ffffff' : 'var(--text-muted)' }} />
                <span className="flex-1 text-left">{item.label}</span>
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
              </button>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div
          className="p-4 border-t space-y-3"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {/* Quick Dark/Light Switch */}
          <button
            onClick={toggleMode}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <div className="flex items-center space-x-2">
              {resolvedMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
              <span>{resolvedMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
            </div>
          </button>

          {/* User info & Sign out */}
          <div
            className="rounded-xl border p-2.5 flex items-center justify-between"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-lg object-cover border"
                  style={{ borderColor: 'var(--border-subtle)' }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center border"
                  style={{
                    backgroundColor: 'var(--accent-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user.displayName || 'Google Account'}
                </div>
                <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={onSignOut}
              disabled={signingOut}
              className="p-1.5 rounded-lg border text-xs hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

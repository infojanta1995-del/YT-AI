import React, { useState } from 'react';
import { type User } from 'firebase/auth';
import { Sidebar } from './Sidebar.tsx';
import { MobileDrawer } from './MobileDrawer.tsx';
import { TopBar } from './TopBar.tsx';
import { SpaceBackground } from '../background/SpaceBackground.tsx';
import { type NavigationPageId } from '../../navigation.ts';

interface AppLayoutProps {
  user: User;
  activePage: NavigationPageId;
  onSelectPage: (id: NavigationPageId) => void;
  onSignOut: () => void;
  signingOut: boolean;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  user,
  activePage,
  onSelectPage,
  onSignOut,
  signingOut,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen flex relative overflow-x-hidden transition-colors"
      style={{
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. Live 3D Space Background (Decorative only, behind UI) */}
      <SpaceBackground />

      {/* 2. Desktop Left Sidebar */}
      <Sidebar
        user={user}
        activePage={activePage}
        onSelectPage={onSelectPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSignOut={onSignOut}
        signingOut={signingOut}
      />

      {/* 3. Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        user={user}
        activePage={activePage}
        onSelectPage={onSelectPage}
        onSignOut={onSignOut}
        signingOut={signingOut}
      />

      {/* 4. Main App Viewport */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <TopBar
          activePage={activePage}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>

        {/* Workspace Footer */}
        <footer
          className="border-t px-6 py-4 text-center text-xs backdrop-blur-md"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-muted)',
          }}
        >
          Google Workspace Connection Portal • Premium AI Workspace Dashboard
        </footer>
      </div>
    </div>
  );
};

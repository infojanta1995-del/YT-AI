import React, { useState } from 'react';
import { type User } from 'firebase/auth';
import {
  User as UserIcon,
  CheckCircle2,
  HardDrive,
  KeyRound,
  ExternalLink,
  Lock,
  Server,
  Layers,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { logOut } from '../services/firebase.ts';
import { DriveStatusCard } from './DriveStatusCard.tsx';
import { GeminiConfigCard } from './GeminiConfigCard.tsx';
import { SourcesTab } from './SourcesTab.tsx';
import { ScriptGeneratorTab } from './ScriptGeneratorTab.tsx';
import { VideoPromptBuilderTab } from './VideoPromptBuilderTab.tsx';
import { SEOStudioTab } from './SEOStudioTab.tsx';
import { ThumbnailStudioTab } from './ThumbnailStudioTab.tsx';
import { YTEditorTab } from './YTEditorTab.tsx';
import { SettingsPage } from './SettingsPage.tsx';
import { AppLayout } from './layout/AppLayout.tsx';
import { type NavigationPageId } from '../navigation.ts';
import { type ScriptGenerationResponse } from '../services/api.ts';

interface DashboardPageProps {
  user: User;
  onSignOut: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onSignOut }) => {
  const [activePage, setActivePage] = useState<NavigationPageId>('overview');
  const [driveConnected, setDriveConnected] = useState<boolean>(false);
  const [signingOut, setSigningOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logOut();
      onSignOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setSigningOut(false);
    }
  };

  const [selectedScriptSourceId, setSelectedScriptSourceId] = useState<string | null>(null);

  const handleSelectSourceForScript = (sourceId: string) => {
    setSelectedScriptSourceId(sourceId);
    setActivePage('scripts');
  };

  const [transferredScript, setTransferredScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredSourceTitle, setTransferredSourceTitle] = useState<string>('');

  const handleTransferToVideoPrompts = (scriptData: ScriptGenerationResponse, sourceTitle?: string) => {
    setTransferredScript(scriptData);
    setTransferredSourceTitle(sourceTitle || `${scriptData.contentMode} Video Script`);
    setActivePage('video-prompts');
  };

  const [transferredSEOScript, setTransferredSEOScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredSEOSourceTitle, setTransferredSEOSourceTitle] = useState<string>('');
  const [transferredSEOSourceArticle, setTransferredSEOSourceArticle] = useState<string>('');

  const handleTransferToSEOStudio = (
    scriptData: ScriptGenerationResponse,
    sourceTitle?: string,
    sourceArticle?: string
  ) => {
    setTransferredSEOScript(scriptData);
    setTransferredSEOSourceTitle(sourceTitle || `${scriptData.contentMode} Video Script`);
    setTransferredSEOSourceArticle(sourceArticle || '');
    setActivePage('seo-studio');
  };

  const [transferredThumbScript, setTransferredThumbScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredThumbSourceTitle, setTransferredThumbSourceTitle] = useState<string>('');
  const [transferredThumbSourceArticle, setTransferredThumbSourceArticle] = useState<string>('');
  const [transferredThumbConcept, setTransferredThumbConcept] = useState<any>(null);

  const [transferredEditorScript, setTransferredEditorScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredEditorSourceTitle, setTransferredEditorSourceTitle] = useState<string>('');

  const handleTransferToYTEditor = (script?: ScriptGenerationResponse | null, sourceTitle?: string) => {
    if (script) setTransferredEditorScript(script);
    if (sourceTitle) setTransferredEditorSourceTitle(sourceTitle);
    setActivePage('yt-editor');
  };

  const handleTransferToThumbnailStudio = (params: {
    script?: ScriptGenerationResponse | null;
    sourceTitle?: string;
    sourceArticle?: string;
    concept?: any;
  }) => {
    if (params.script) setTransferredThumbScript(params.script);
    if (params.sourceTitle) setTransferredThumbSourceTitle(params.sourceTitle);
    if (params.sourceArticle) setTransferredThumbSourceArticle(params.sourceArticle);
    if (params.concept) setTransferredThumbConcept(params.concept);
    setActivePage('thumbnail-studio');
  };

  return (
    <AppLayout
      user={user}
      activePage={activePage}
      onSelectPage={setActivePage}
      onSignOut={handleSignOut}
      signingOut={signingOut}
    >
      {/* 1. OVERVIEW PAGE */}
      {activePage === 'overview' && (
        <div className="space-y-8">
          {/* Account Identity Summary Card */}
          <section
            className="rounded-2xl p-6 border shadow-xl backdrop-blur-md relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User profile'}
                    className="w-14 h-14 rounded-2xl border-2 object-cover shadow-lg"
                    style={{ borderColor: 'var(--accent-primary)' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: 'var(--accent-subtle)',
                      borderColor: 'var(--accent-primary)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <UserIcon className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {user.displayName || 'Google Account'}
                    </h2>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Google Authenticated</span>
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {user.email}
                  </p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    UID: {user.uid.slice(0, 8)}...{user.uid.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                <div
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs"
                  style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Google Auth:</span>
                  <span className="text-emerald-400 font-medium">Verified Active</span>
                </div>
                <div
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs"
                  style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Drive Status:</span>
                  <span className={driveConnected ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                    {driveConnected ? 'Authorized' : 'Disconnected'}
                  </span>
                </div>
                <div
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs"
                  style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Session Mode:</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>In-Memory Tokens</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 1: Google Drive Authorization Management */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center space-x-2" style={{ color: 'var(--text-secondary)' }}>
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span>Workspace Authorization</span>
              </h3>
            </div>
            <DriveStatusCard onDriveStatusChange={setDriveConnected} />
          </section>

          {/* Section 2: Developer Portals & Documentation */}
          <section
            className="rounded-2xl p-6 border shadow-xl backdrop-blur-md"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl text-blue-400 bg-blue-500/10 border border-blue-500/20">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Official Google Developer Portals
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Direct links to Google resources for credential configuration and documentation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border transition-all group block hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    Google AI Studio Keys
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:text-indigo-400" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Generate and manage Gemini API keys with project quotas and tiered pricing controls.
                </p>
              </a>

              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border transition-all group block hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    Google Cloud Credentials
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:text-indigo-400" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Inspect Google Cloud OAuth 2.0 Client IDs, authorized origins, and service account keys.
                </p>
              </a>

              <a
                href="https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border transition-all group block hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    gemini-3.8-flash Docs
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:text-indigo-400" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Official specifications for the mandatory Gemini 3.8 Flash model used by this application.
                </p>
              </a>
            </div>
          </section>

          {/* Section 3: Security Architecture & Audit Overview */}
          <section
            className="rounded-2xl p-6 border shadow-xl backdrop-blur-md"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Security Architecture & Audit Verification
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Full-stack controls implemented in Phase 1 of this portal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="font-semibold flex items-center space-x-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AES-256-GCM Encryption</span>
                </div>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Stored API keys are encrypted server-side using 256-bit Galois/Counter Mode with authenticating integrity tags before persistence.
                </p>
              </div>

              <div
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="font-semibold flex items-center space-x-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Memory Token Isolation</span>
                </div>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  OAuth access tokens are cached solely in volatile memory and are purged on sign out. Tokens are never stored in browser disk storage.
                </p>
              </div>

              <div
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="font-semibold flex items-center space-x-1.5" style={{ color: 'var(--text-primary)' }}>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mandatory Model Enforced</span>
                </div>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Validation queries enforce model <code className="font-mono text-indigo-400">gemini-3.8-flash</code> via a single centralized constant with zero silent fallback.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. SOURCES PAGE */}
      {activePage === 'sources' && (
        <SourcesTab
          userId={user.uid}
          onSelectForScript={handleSelectSourceForScript}
        />
      )}

      {/* 3. SCRIPT GENERATOR PAGE */}
      {activePage === 'scripts' && (
        <ScriptGeneratorTab
          userId={user.uid}
          initialSourceId={selectedScriptSourceId}
          onNavigateToSources={() => setActivePage('sources')}
          onNavigateToConfig={() => setActivePage('api-keys')}
          onTransferToVideoPrompts={handleTransferToVideoPrompts}
          onTransferToSEOStudio={handleTransferToSEOStudio}
          onTransferToThumbnailStudio={(script, title, article) =>
            handleTransferToThumbnailStudio({ script, sourceTitle: title, sourceArticle: article })
          }
          onTransferToYTEditor={(script, title) =>
            handleTransferToYTEditor(script, title)
          }
        />
      )}

      {/* 4. VIDEO PROMPT BUILDER PAGE */}
      {activePage === 'video-prompts' && (
        <VideoPromptBuilderTab
          userId={user.uid}
          transferredScript={transferredScript}
          transferredSourceTitle={transferredSourceTitle}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
          onNavigateToOverview={() => setActivePage('overview')}
        />
      )}

      {/* 5. SEO STUDIO PAGE */}
      {activePage === 'seo-studio' && (
        <SEOStudioTab
          userId={user.uid}
          transferredScript={transferredSEOScript}
          transferredSourceTitle={transferredSEOSourceTitle}
          transferredSourceArticle={transferredSEOSourceArticle}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
          onTransferToThumbnailStudio={(params) =>
            handleTransferToThumbnailStudio(params)
          }
        />
      )}

      {/* 6. THUMBNAIL STUDIO PAGE */}
      {activePage === 'thumbnail-studio' && (
        <ThumbnailStudioTab
          userId={user.uid}
          transferredScript={transferredThumbScript}
          transferredSourceTitle={transferredThumbSourceTitle}
          transferredSourceArticle={transferredThumbSourceArticle}
          transferredConcept={transferredThumbConcept}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
        />
      )}

      {/* 7. YT EDITOR PAGE */}
      {activePage === 'yt-editor' && (
        <YTEditorTab
          userId={user.uid}
          transferredScript={transferredEditorScript}
          transferredSourceTitle={transferredEditorSourceTitle}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
        />
      )}

      {/* 8. API CONFIGURATION PAGE */}
      {activePage === 'api-keys' && (
        <div className="space-y-6">
          <GeminiConfigCard userId={user.uid} />
        </div>
      )}

      {/* 7. SETTINGS PAGE */}
      {activePage === 'settings' && (
        <SettingsPage />
      )}
    </AppLayout>
  );
};

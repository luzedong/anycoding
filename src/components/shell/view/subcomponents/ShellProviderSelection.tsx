import { useTranslation } from 'react-i18next';
import type { SessionProvider } from '../../../../types/app';
import SessionProviderLogo from '../../../llm-logo-provider/SessionProviderLogo';

type ShellProviderOption = SessionProvider | 'opencode' | 'system';

const SHELL_PROVIDERS: Array<{ id: ShellProviderOption }> = [
  { id: 'claude' },
  { id: 'codex' },
  { id: 'opencode' },
  { id: 'cursor' },
  { id: 'gemini' },
  { id: 'system' },
];

export type ShellProviderSelectionProps = {
  onSelect: (mode: ShellProviderOption) => void;
};

export default function ShellProviderSelection({ onSelect }: ShellProviderSelectionProps) {
  const { t } = useTranslation('chat');

  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t('shell.providerSelection.title')}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            {t('shell.providerSelection.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {SHELL_PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className="relative flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card/70 px-6 py-8 text-center transition-all duration-150 hover:border-border/80 hover:bg-card hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
                {p.id === 'system' ? (
                  <span className="text-2xl font-mono text-foreground">$</span>
                ) : (
                  <SessionProviderLogo provider={p.id} className="h-10 w-10" />
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold leading-none text-foreground">
                  {t(`shell.providerSelection.providers.${p.id}.name`)}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {t(`shell.providerSelection.providers.${p.id}.description`)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

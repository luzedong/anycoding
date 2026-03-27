type OpenCodeLogoProps = {
  className?: string;
};

export default function OpenCodeLogo({ className = 'w-5 h-5' }: OpenCodeLogoProps) {
  return <img src="/icons/opencode.ico" alt="OpenCode" className={className} />;
}

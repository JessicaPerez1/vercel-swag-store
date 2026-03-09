export function CurrentYear() {
  const yearFromEnv = process.env.BUILD_YEAR ?? process.env.VERCEL_GIT_COMMIT_DATE?.slice(0, 4);
  return <>{yearFromEnv ?? '2026'}</>;
}
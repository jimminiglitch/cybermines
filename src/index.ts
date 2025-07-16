import Cybermines from './components/cybermines.tsx'
import './styles/cybermines.css'

export { default as Cybermines } from './components/cybermines.tsx'
export type { GameMode } from './components/cybermines.tsx'
export * from './components/cybermines/types.ts'

// Global exposure for UMD builds
if (typeof window !== 'undefined') {
  (window as unknown as { CyberminesGame: typeof Cybermines }).CyberminesGame = Cybermines;
}

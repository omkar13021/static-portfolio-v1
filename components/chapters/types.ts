/** Props every chapter scene receives from the Stage (REQUIREMENTS §4). */
export interface SceneProps {
  /** Normalized pointer parallax, -1..1 on each axis. */
  parallax: { x: number; y: number };
}

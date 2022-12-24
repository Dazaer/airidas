/** This number represents pixels */
export enum VisualBreakpoints {
	Mobile = 720,
}

export function isMobile() {
  const userWindowWidth = window.screen.width //* window.devicePixelRatio
  return VisualBreakpoints.Mobile > userWindowWidth
}
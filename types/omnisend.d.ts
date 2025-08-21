declare global {
  interface Window {
    omnisend?: Array<any> & {
      push: (data: any[]) => void
    }
  }
}

export {}

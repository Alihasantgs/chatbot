import 'vite'
import type { InlineConfig } from 'vitest'

declare module 'vite' {
  interface UserConfig {
    test?: InlineConfig['test']
  }
  interface UserConfigExport {
    test?: InlineConfig['test']
  }
}


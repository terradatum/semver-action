export type PackageManagerType = 'npm' | 'maven'

export interface ISettings {
  /**
   * Version
   */
  version: string

  /**
   * Package manager type
   */
  packageManagerType: string

  /**
   * Bump - the type of version increment (e.g. patch, minor, major, prerelease, etc.)
   */
  bump: string
}

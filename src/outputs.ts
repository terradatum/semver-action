import {inc, ReleaseType, SemVer} from 'semver'

export interface IOutputs {
  /**
   * Version - the current version
   */
  version: SemVer

  /**
   * Build version - the version used to build
   */
  buildVersion: SemVer | undefined

  /**
   * Next version - the next version to set after the build
   */
  nextVersion: SemVer | undefined

  /**
   * Whether the current version is a SNAPSHOT
   */
  snapshotRelease: boolean
}

export class Outputs implements IOutputs {
  version: SemVer
  buildVersion: SemVer | undefined
  nextVersion: SemVer | undefined
  snapshotRelease = false
  constructor(version: string, bump: string) {
    this.snapshotRelease = version.endsWith('-SNAPSHOT')
    this.version = new SemVer(version)
    const versionNoSnapshot = version.replace('-SNAPSHOT', '')
    const previousVersion = new SemVer(versionNoSnapshot)
    const buildVersion =
      this.snapshotRelease && bump === 'patch'
        ? previousVersion
        : inc(previousVersion.toString(), bump as ReleaseType)

    if (buildVersion) {
      this.buildVersion = new SemVer(buildVersion)
      const n = inc(buildVersion.toString(), bump as ReleaseType)
      const nextVersion = this.snapshotRelease ? `${n}-SNAPSHOT` : n
      if (nextVersion) {
        this.nextVersion = new SemVer(nextVersion)
      }
    }
  }
}

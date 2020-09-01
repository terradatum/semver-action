import {inc, ReleaseType, SemVer} from 'semver'

export interface IOutputs {
  /**
   * Version - the current version
   */
  version: SemVer

  /**
   * Build version - the version used to build
   */
  nextVersion: SemVer | undefined

  /**
   * Next version - the next version to set after the build
   */
  nextSnapshotVersion: SemVer | undefined

  /**
   * Whether the current version is a SNAPSHOT
   */
  snapshotRelease: boolean
}

export class Outputs implements IOutputs {
  version: SemVer = new SemVer('0.0.0')
  nextVersion: SemVer | undefined
  nextSnapshotVersion: SemVer | undefined
  snapshotRelease = false

  /**
   * Set the various versions based on the initial version string, and based on the following:
   * 1. SNAPSHOTS:
   *    a. Version: the version found in the pom.xml. E.g. 1.0.0-SNAPSHOT
   *    b. Next Version: the version to use when building.
   *       * If it's a patch, then the SNAPSHOT version is used without incrementing. E.g. 1.0.0
   *       * If it's a minor or major, then those are incremented. E.g. 1.1.0
   *    c. Snapshot Version: the next version - should be checked-in to git. E.g. 1.0.1-SNAPSHOT or 1.1.0-SNAPSHOT
   * 2. All others
   *    a. Version: the version found in the package manager file (npm or maven). E.g. 1.0.0
   *    b. Next Version: the version to use when building. E.g. 1.0.1
   *
   * NOTE: The SemVer class is NOT threadsafe. When you create a new SemVer instance using another SemVer instance as
   * the constructor parameter, the new SemVer instance is a reference to the old. This means that any operation on one
   * will effect the other, i.e. if `nextVersion` is 1.0.1, and you `newVersion = new SemVer(nextVersion)` and
   * subsequently `nextVersion.inc('patch')`, both `nextVersion` and `newVersion` will be 1.0.2.
   *
   * @param version - the version string
   * @param bump - version bump
   */
  async setVersions(version: string, bump: string): Promise<void> {
    this.snapshotRelease = version.endsWith('-SNAPSHOT')
    this.version = new SemVer(version)
    if (bump) {
      this.nextVersion = new SemVer(`${this.version}`).inc(bump as ReleaseType)
      if (this.snapshotRelease) {
        const nextSnapshotVersion = new SemVer(`${this.nextVersion}`).inc(bump as ReleaseType)
        this.nextSnapshotVersion = new SemVer(`${nextSnapshotVersion}-SNAPSHOT`)
      }
    }
  }
}

import * as core from '@actions/core'
import {IOutputs} from './outputs'

export async function setOutputs(outputs: IOutputs): Promise<void> {
  core.setOutput('snapshot-release', Boolean(outputs?.snapshotRelease))
  core.setOutput('version', String(outputs.version))
  core.setOutput('major', String(outputs.version?.major))
  core.setOutput('minor', String(outputs.version?.minor))
  core.setOutput('patch', String(outputs.version?.patch))
  core.setOutput('pre-release', String(outputs.version?.prerelease))
  core.setOutput('next-version', String(outputs.nextVersion))
  core.setOutput('next-major', String(outputs.nextVersion?.major))
  core.setOutput('next-minor', String(outputs.nextVersion?.minor))
  core.setOutput('next-patch', String(outputs.nextVersion?.patch))
  core.setOutput('next-pre-release', String(outputs.nextVersion?.prerelease))
  core.setOutput('next-snapshot-version', String(outputs?.nextSnapshotVersion))
  core.setOutput(
    'next-snapshot-major',
    String(outputs?.nextSnapshotVersion?.major)
  )
  core.setOutput(
    'next-snapshot-minor',
    String(outputs?.nextSnapshotVersion?.minor)
  )
  core.setOutput(
    'next-snapshot-patch',
    String(outputs?.nextSnapshotVersion?.patch)
  )
}

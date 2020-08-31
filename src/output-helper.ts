import * as core from '@actions/core'
import {IOutputs} from './outputs'

export async function setOutputs(outputs: IOutputs): Promise<void> {
  core.setOutput('snapshot-release', Boolean(outputs?.snapshotRelease))
  core.setOutput('version', String(outputs?.version))
  core.setOutput('major', String(outputs?.version?.major))
  core.setOutput('minor', String(outputs?.version?.minor))
  core.setOutput('patch', String(outputs?.version?.patch))
  core.setOutput('next-version', String(outputs?.nextVersion))
  core.setOutput('next-major', String(outputs?.nextVersion?.major))
  core.setOutput('next-minor', String(outputs?.nextVersion?.minor))
  core.setOutput('next-patch', String(outputs?.nextVersion?.patch))
  core.setOutput('build-version', String(outputs?.buildVersion))
  core.setOutput('build-major', String(outputs?.buildVersion?.major))
  core.setOutput('build-minor', String(outputs?.buildVersion?.minor))
  core.setOutput('build-patch', String(outputs?.buildVersion?.patch))
}

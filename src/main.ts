import * as core from '@actions/core'
import * as inputHelper from './input-helper'
import * as outputHelper from './output-helper'
import {ReleaseType} from 'semver'
import {Outputs} from './outputs'

async function run(): Promise<void> {
  try {
    const settings = await inputHelper.getInputs()
    core.debug(
      `Running semver-action with the following action settings:\n${JSON.stringify(
        settings
      )}`
    )
    const outputs = new Outputs()
    await outputs.setVersions(settings.version, settings.bump as ReleaseType)
    core.startGroup('Semantic Versions')
    core.info(`Version: ${outputs.version}`)
    core.info(`Version MAJOR: ${outputs.version.major}`)
    core.info(`Version MINOR: ${outputs.version.minor}`)
    core.info(`Version PATCH: ${outputs.version.patch}`)
    core.info(`Next Version: ${outputs.nextVersion}`)
    core.info(`Next Version MAJOR: ${outputs.nextVersion?.major}`)
    core.info(`Next Version MINOR: ${outputs.nextVersion?.minor}`)
    core.info(`Next Version PATCH: ${outputs.nextVersion?.patch}`)
    core.info(`Next Snapshot Version: ${outputs.nextSnapshotVersion}`)
    core.info(
      `Next Snapshot Version MAJOR: ${outputs.nextSnapshotVersion?.major}`
    )
    core.info(
      `Next Snapshot Version MINOR: ${outputs.nextSnapshotVersion?.minor}`
    )
    core.info(
      `Next Snapshot Version PATCH: ${outputs.nextSnapshotVersion?.patch}`
    )
    core.endGroup()
    await outputHelper.setOutputs(outputs)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

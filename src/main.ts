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
    const outputs = new Outputs(settings.version, settings.bump as ReleaseType)
    outputHelper.setOutputs(outputs)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

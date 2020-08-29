import * as core from '@actions/core'
import * as inputHelper from './input-helper'

async function run(): Promise<void> {
  const settings = inputHelper.getInputs()

  try {
    core.debug(
      `Running template-action with the following action settings:\n${JSON.stringify(
        settings
      )}`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

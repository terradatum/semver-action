import * as core from '@actions/core'
import * as outputHelper from '../src/output-helper'
import {Outputs, IOutputs} from '../src/outputs'
import {SemVer} from 'semver'
import * as fsHelper from '../src/fs-helper'
import * as path from 'path'

const originalGitHubWorkspace = process.env['GITHUB_WORKSPACE']
const gitHubWorkspace = path.resolve('/checkout-tests/workspace')

// Inputs for mock @actions/core
let outputs = {} as any

describe('output-helper tests', () => {
})

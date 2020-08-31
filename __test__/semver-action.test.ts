import * as core from '@actions/core'
import * as inputHelper from '../src/input-helper'
import {ISettings} from '../src/settings'
import {Outputs} from '../src/outputs'
import {ReleaseType, SemVer} from 'semver'

const readFile = jest.fn()
const readFileSync = jest.fn()

jest.mock('fs', () => ({
  readFile: (...args) => readFile(...args),
  readFileSync: (...args) => readFileSync(...args)
}))

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const mockReadFile = (result: string) =>
  readFile.mockImplementation((path, options, callback) =>
    callback(undefined, result)
  )

// Inputs for mock @actions/core
let inputs = {}

describe('semver-action tests', () => {
  beforeAll(() => {
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      const val: string = inputs[name] || ''
      return val.trim()
    })

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    inputs = {}
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('work with versions with no package manager', () => {
    test('sets defaults', async () => {
      const settings: ISettings = await inputHelper.getInputs()
      expect(settings).toBeTruthy()
      expect(settings.version).toBeFalsy()
      expect(settings.packageManagerType).toBeFalsy()
      expect(settings.bump).toBeFalsy()
    })

    test('should get version from input', async () => {
      inputs['version'] = 'v1.0.0'

      const settings: ISettings = await inputHelper.getInputs()
      expect(settings.version).toBeTruthy()
      expect(settings.version).toEqual('v1.0.0')

      const outputs = new Outputs(
        settings.version,
        settings.bump as ReleaseType
      )
      expect(outputs.version).toBeTruthy()
      expect(outputs.version).toEqual(new SemVer('v1.0.0'))
    })
  })

  describe('work with versions from npm', () => {
    test('should get version from package.json', async () => {
      inputs['package-manager-type'] = 'npm'
      mockReadFile(`
          {
            "name": "@terradatum/foo",
            "version": "1.0.0"
          }
        `)

      const settings: ISettings = await inputHelper.getInputs()
      expect(settings.packageManagerType).toBeTruthy()
      expect(settings.packageManagerType).toEqual('npm')
      expect(settings.version).toBeTruthy()
      expect(settings.version).toEqual('1.0.0')

      const outputs = new Outputs(
        settings.version,
        settings.bump as ReleaseType
      )
      expect(outputs.version).toBeTruthy()
      expect(outputs.version).toEqual(new SemVer('1.0.0'))
    })

    test('should get version from package.json increment version during PATCH bump', async () => {
      inputs['package-manager-type'] = 'npm'
      inputs['bump'] = 'patch'
      mockReadFile(`
          {
            "name": "@terradatum/foo",
            "version": "1.0.0"
          }
        `)

      const settings: ISettings = await inputHelper.getInputs()
      expect(settings.packageManagerType).toBeTruthy()
      expect(settings.packageManagerType).toEqual('npm')
      expect(settings.version).toBeTruthy()
      expect(settings.version).toEqual('1.0.0')

      const outputs = new Outputs(
        settings.version,
        settings.bump as ReleaseType
      )
      expect(outputs.version).toBeTruthy()
      expect(outputs.version).toEqual(new SemVer('1.0.0'))
      expect(outputs?.buildVersion).toEqual(new SemVer('1.0.1'))
      expect(outputs?.buildVersion?.major).toEqual(1)
      expect(outputs?.buildVersion?.minor).toEqual(0)
      expect(outputs?.buildVersion?.patch).toEqual(1)
      expect(outputs?.nextVersion).toEqual(new SemVer('1.0.2'))
      expect(outputs?.nextVersion?.major).toEqual(1)
      expect(outputs?.nextVersion?.minor).toEqual(0)
      expect(outputs?.nextVersion?.patch).toEqual(2)
    })

    test('should get version from package.json and increment MINOR version during bump', async () => {
      inputs['package-manager-type'] = 'npm'
      inputs['bump'] = 'minor'
      mockReadFile(`
          {
            "name": "@terradatum/foo",
            "version": "1.0.0"
          }
        `)

      const settings: ISettings = await inputHelper.getInputs()
      expect(settings.packageManagerType).toBeTruthy()
      expect(settings.packageManagerType).toEqual('npm')
      expect(settings.version).toBeTruthy()
      expect(settings.version).toEqual('1.0.0')

      const outputs = new Outputs(
        settings.version,
        settings.bump as ReleaseType
      )
      expect(outputs.version).toBeTruthy()
      expect(outputs.version).toEqual(new SemVer('1.0.0'))
      expect(outputs?.buildVersion).toEqual(new SemVer('1.1.0'))
      expect(outputs?.buildVersion?.major).toEqual(1)
      expect(outputs?.buildVersion?.minor).toEqual(1)
      expect(outputs?.buildVersion?.patch).toEqual(0)
      expect(outputs?.nextVersion).toEqual(new SemVer('1.2.0'))
      expect(outputs?.nextVersion?.major).toEqual(1)
      expect(outputs?.nextVersion?.minor).toEqual(2)
      expect(outputs?.nextVersion?.patch).toEqual(0)
    })
  })

  describe('work with versions from maven', () => {
    test('should get SNAPSHOT version from pom.xml', async () => {
      inputs['package-manager-type'] = 'maven'
      mockReadFile(`
          <project
            xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
            <version>1.0.0-SNAPSHOT</version>
          </project>
        `)

      const settings: ISettings = await inputHelper.getInputs()
      expect(settings.packageManagerType).toBeTruthy()
      expect(settings.packageManagerType).toEqual('maven')
      expect(settings.version).toBeTruthy()
      expect(settings.version).toEqual('1.0.0-SNAPSHOT')

      const outputs = new Outputs(
        settings.version,
        settings.bump as ReleaseType
      )
      expect(outputs.version).toBeTruthy()
      expect(outputs.version).toEqual(new SemVer('1.0.0-SNAPSHOT'))
      expect(outputs?.version?.prerelease.length > 0).toBeTruthy()
    })

    test('should get SNAPSHOT version from pom.xml and leave the PATCH version alone during bump', async () => {
      inputs['package-manager-type'] = 'maven'
      inputs['bump'] = 'patch'
      mockReadFile(`
          <project
            xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
            <version>1.0.0-SNAPSHOT</version>
          </project>
        `)

      const settings: ISettings = await inputHelper.getInputs()
      expect(settings.packageManagerType).toBeTruthy()
      expect(settings.packageManagerType).toEqual('maven')
      expect(settings.version).toBeTruthy()
      expect(settings.version).toEqual('1.0.0-SNAPSHOT')

      const outputs = new Outputs(
        settings.version,
        settings.bump as ReleaseType
      )
      expect(outputs.version).toBeTruthy()
      expect(outputs.version).toEqual(new SemVer('1.0.0-SNAPSHOT'))
      expect(outputs.snapshotRelease).toBeTruthy()
      expect(outputs?.buildVersion).toEqual(new SemVer('1.0.0'))
      expect(outputs?.buildVersion?.major).toEqual(1)
      expect(outputs?.buildVersion?.minor).toEqual(0)
      expect(outputs?.buildVersion?.patch).toEqual(0)
      expect(outputs?.nextVersion).toEqual(new SemVer('1.0.1-SNAPSHOT'))
      expect(outputs?.nextVersion?.major).toEqual(1)
      expect(outputs?.nextVersion?.minor).toEqual(0)
      expect(outputs?.nextVersion?.patch).toEqual(1)
    })

    test('should get SNAPSHOT version from pom.xml increment MINOR version during bump', async () => {
      inputs['package-manager-type'] = 'maven'
      inputs['bump'] = 'minor'
      mockReadFile(`
          <project
            xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
            <version>1.0.0-SNAPSHOT</version>
          </project>
        `)

      const settings: ISettings = await inputHelper.getInputs()
      expect(settings.packageManagerType).toBeTruthy()
      expect(settings.packageManagerType).toEqual('maven')
      expect(settings.version).toBeTruthy()
      expect(settings.version).toEqual('1.0.0-SNAPSHOT')

      const outputs = new Outputs(
        settings.version,
        settings.bump as ReleaseType
      )
      expect(outputs.version).toBeTruthy()
      expect(outputs.version).toEqual(new SemVer('1.0.0-SNAPSHOT'))
      expect(outputs.snapshotRelease).toBeTruthy()
      expect(outputs?.buildVersion).toEqual(new SemVer('1.1.0'))
      expect(outputs?.buildVersion?.major).toEqual(1)
      expect(outputs?.buildVersion?.minor).toEqual(1)
      expect(outputs?.buildVersion?.patch).toEqual(0)
      expect(outputs?.nextVersion).toEqual(new SemVer('1.2.0-SNAPSHOT'))
      expect(outputs?.nextVersion?.major).toEqual(1)
      expect(outputs?.nextVersion?.minor).toEqual(2)
      expect(outputs?.nextVersion?.patch).toEqual(0)
    })
  })
})

import * as core from '@actions/core'
import {ISettings} from './settings'
import * as fs from 'fs'
import {promisify} from 'util'
import path from 'path'
import {IPom, parse} from 'pom-parser'

const readFile = promisify(fs.readFile)
const parsePom = promisify(parse)

export async function getInputs(): Promise<ISettings> {
  const result = ({} as unknown) as ISettings

  result.version = core.getInput('version')
  result.packageManagerType = core.getInput('package-manager-type')
  switch (result.packageManagerType) {
    case 'maven': {
      const pomXml: IPom = await loadPomXml()
      if (pomXml?.pomObject?.project?.version) {
        result.version = pomXml.pomObject.project.version
      }
      break
    }
    case 'npm': {
      const packageJson = await loadPackageJson()
      if (packageJson?.version) {
        result.version = packageJson.version
      }
      break
    }
  }
  result.bump = core.getInput('bump')
  return result
}

export async function loadPackageJson(root = './'): Promise<IPackageJSON> {
  return JSON.parse(await readFile(path.join(root, 'package.json'), 'utf-8'))
}

export async function loadPomXml(root = './'): Promise<IPom> {
  return parsePom({filePath: path.join(root, 'pom.xml')})
}

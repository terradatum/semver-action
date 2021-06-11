import {IPom, parse} from 'pom-parser'
import path from 'path'
import {promisify} from 'util'
import {SemVer} from 'semver'

const parsePom = promisify(parse)

export async function getVersionFromPom(): Promise<string> {
  let pomVersion = '0.0.0'
  const pomXml: IPom = await loadPomXml()
  if (pomXml?.pomObject?.project?.version) {
    pomVersion = pomXml.pomObject.project.version
  }
  return pomVersion
}

export async function loadPomXml(root = './'): Promise<IPom> {
  return parsePom({filePath: path.join(root, 'pom.xml')})
}

import {IPom, parse} from 'pom-parser'
import path from 'path'
import {promisify} from 'util'
import {SemVer} from 'semver'

const parsePom = promisify(parse)

export async function getVersion(): Promise<string> {

}

export async function getVersionFromPom(): Promise<SemVer> {
  let pomVersion = '0.0.0'
  const pomXml: IPom = await loadPomXml()
  if (pomXml?.pomObject?.project?.version) {
    pomVersion = pomXml.pomObject.project.version
  }
  return new SemVer(pomVersion)
}

export async function getVersionFromRepository(): Promise<SemVer> {
  let repoVersion = '0.0.0'

  return ''
}

export async function loadPomXml(root = './'): Promise<IPom> {
  return parsePom({filePath: path.join(root, 'pom.xml')})
}

export async function getLatestRelease(url: strung) {
  let npm = new NpmApi()
}

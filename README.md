# SemVer Action

## Workflow

The semver-action GitHub Action reads and modifies semantic versions in-memory. This action does not modify files or
git history. That is left to the user.

Set the various versions based on the initial version string, and based on the following:
1. SNAPSHOTS:
  a. Version: the version found in the pom.xml. E.g. 1.0.0-SNAPSHOT
  b. Next Version: the version to use when building. This is the version without the '-SNAPSHOT' suffix. E.g. 1.0.0
  c. Snapshot Version: the next SNAPSHOT version - should be checked-in to git. E.g. 1.0.1-SNAPSHOT or 1.1.0-SNAPSHOT
2. All others
  a. Version: the version found in the package manager file (npm or maven). E.g. 1.0.0
  b. Next Version: the version to use when building. E.g. 1.0.1

## Usage

<!-- start usage -->
```yaml
- uses: terradatum/semver-action@main
  with:
    # The current version passed as an input to the action.
    version: ''

    # The type of package manager. One of maven, npm. Used to collect the current
    # version from the package manager file associated with that package manager (e.g.
    # npm => package.json, maven = pom.xml, etc.).
    package-manager-type: ''

    # The type of version increment (e.g. patch, minor, major, prerelease, etc.). This
    # action is READ-ONLY for the filesystem.
    bump: ''
```
```yaml
outputs:
  # Whether the version is a SNAPSHOT
  snapshot-release: ''

  # The current version.
  version: ''

  # The current MAJOR version.
  major: ''

  # The current MINOR version.
  minor: ''

  # The current PATCH version.
  patch: ''

  # The current PRE-RELEASE version.
  pre-release: ''

  # The version used to next.
  next-version: ''

  # The next MAJOR version.
  next-major: ''

  # The next MINOR version.
  next-minor: ''

  # The next PATCH version.
  next-patch: ''

  # The current PRE-RELEASE version.
  next-pre-release: ''

  # the next SNAPSHOT version to set after the build.
  next-snapshot-version: ''

  # The next SNAPSHOT MAJOR version.
  next-snapshot-major: ''

  # The next SNAPSHOT MINOR version.
  next-snapshot-minor: ''

  # The next SNAPSHOT PATCH version.
  next-snapshot-patch: ''
```
<!-- end usage -->

### Basic Usage

Using an input version:

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - uses: @terradatum/semver-action
    with:
      version: v1.0.0
```

### Advanced Usage

Using an npm Package Manager Type and bump based on `auto version`:

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - name: Get bump
    id: get_bump
    run: echo "::set-output name=bump::$(auto version)"
  - uses: @terradatum/semver-action
    with:
      package-manager-type: npm
      bump: ${{ steps.get_bump.outputs.bump }}
```

## Changelog
See [CHANGELOG][changelog-url].

## License
This project released under the [MIT License][license-url].

<!-- Links: -->
[license-url]: https://github.com/terradatum/semver-action/blob/main/LICENSE.md

[changelog-url]: https://github.com/terradatum/semver-action/blob/main/CHANGELOG.md

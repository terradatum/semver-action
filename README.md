# Action Template for Typescript

## Workflow

Fork this repository as a template

## Usage

Using an input version

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - name: Get the semver-action private action
    with:
      repository: terradatum/semver-action
      token: ${{ secrets.GH_PAT }}
      path: ./.github/actions/semver-action
  - uses: ./.github/actions/semver-action
    with:
      version: 'v1.0.0'
```

<!-- start usage -->
```yaml
- uses: terradatum/semver-action@master
  with:
    # The current version.
    version: ''

    # The type of package manager. One of maven, npm.
    package-manager-type: ''

    # The type of version increment (e.g. patch, minor, major, prerelease, etc.).
    bump: ''
```
<!-- end usage -->

### Basic Usage

TBD

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
```

### Advanced Usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
```

## Changelog
See [CHANGELOG][changelog-url].

## License
This project released under the [MIT License][license-url].

<!-- Links: -->
[license-url]: https://github.com/terradatum/template-action/blob/master/LICENSE.md

[changelog-url]: https://github.com/terradatum/template-action/blob/master/CHANGELOG.md

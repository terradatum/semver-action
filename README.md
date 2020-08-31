# Action Template for Typescript

## Workflow

Fork this repository as a template

## Usage

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
[license-url]: https://github.com/terradatum/semver-action/blob/master/LICENSE.md

[changelog-url]: https://github.com/terradatum/semver-action/blob/master/CHANGELOG.md

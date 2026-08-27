# Releasing

Use this checklist for every release, in order, from a clean checkout of the reviewed release commit. Stop if any verification fails.

This checklist was added after 0.0.2 shipped to npm with no git tag and no commit on `main` representing it. 0.0.3 (2026-08-27) was the first release where the npm package, the MCP registry entry, and a signed git tag all traced to one commit — keep it that way.

## Canonical metadata

- Name: Nutrient Document Engine MCP Server
- Repository: `https://github.com/PSPDFKit/nutrient-document-engine-mcp-server`
- npm package: `@nutrient-sdk/document-engine-mcp-server`
- MCP Registry name: `io.github.PSPDFKit/nutrient-document-engine-mcp-server`
- Transport: stdio (the HTTP transport is optional and requires inbound auth)

## 1. Prepare the release

- [ ] Confirm the release commit is reviewed and merged to `main`, and the working tree is clean.
- [ ] Set the version: `VERSION=x.y.z`.
- [ ] Update `package.json` `version` to `${VERSION}`. Do not change the package name or `mcpName`.
- [ ] Update both `version` and `packages[0].version` in `server.json` to `${VERSION}`.
- [ ] Add `## [${VERSION}] - YYYY-MM-DD` to `CHANGELOG.md` covering user-visible changes, configuration changes, and breaking changes.
- [ ] Land these through the normal review process (this repo enforces one approving review; the author cannot self-approve).

## 2. Run release gates

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm run lint`
- [ ] `pnpm run build`
- [ ] `pnpm test`
- [ ] `npm publish --dry-run` — confirm the file list is `dist`, `README.md`, `LICENSE`, `package.json` and the version is `${VERSION}`.

## 3. Tag

- [ ] `git tag -s "v${VERSION}" -m "Document Engine MCP v${VERSION}"`
- [ ] Push the tag: `git push origin "v${VERSION}"`.
- [ ] Verify `git rev-list -n 1 "v${VERSION}"` is the reviewed release commit.

## 4. Publish npm

- [ ] Confirm identity: `npm whoami`. A publish failing with `E404 Not Found` on `PUT` usually means the npm session expired (`npm whoami` returns `E401`) — run `npm login` and retry; it is not a package-access error.
- [ ] `npm publish --access public` (with `--otp` when prompted). `prepublishOnly` runs the build automatically; dependencies must be installed first.
- [ ] Verify: `npm view "@nutrient-sdk/document-engine-mcp-server@${VERSION}" version mcpName`— `mcpName` must be present in the published package or the registry publish below will fail.

## 5. GitHub Release

- [ ] `gh release create "v${VERSION}" --verify-tag --title "Document Engine MCP v${VERSION}" --generate-notes`

## 6. Publish to the official MCP Registry

- [ ] Confirm npm already serves `${VERSION}` and `server.json` names that same version.
- [ ] Authenticate: PSPDFKit enforces SAML SSO, so the interactive device flow only grants the personal namespace. Create a **classic** PAT with only the `read:org` scope, authorize it for PSPDFKit via **Configure SSO**, then `mcp-publisher login github -token <PAT>`. Note: `mcp-publisher` ≥ 1.8 stores tokens under `~/.config/mcp-publisher/`; re-login after upgrading.
- [ ] From the repository root: `mcp-publisher publish`.
- [ ] Verify: `curl -fsSL 'https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.PSPDFKit%2Fnutrient-document-engine-mcp-server'` shows `${VERSION}` as latest/active.
- [ ] Revoke the PAT.

## 7. Final verification

- [ ] Tag, npm package, GitHub Release, and MCP Registry entry all show `${VERSION}` and point at the same commit.

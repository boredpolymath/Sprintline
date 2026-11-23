# Contributing to Sprintline

Search [existing issues](https://github.com/boredpolymath/Sprintline/issues) before reporting a bug or requesting a feature. For bugs, include the steps to reproduce the problem, the expected and actual behavior, and your browser and operating system. Use sample workspace data in public reports.

Report vulnerabilities through the [security policy](SECURITY.md). Participation is covered by the [code of conduct](CODE_OF_CONDUCT.md).

## Run locally

From the repository root, start a static server with Python 3.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/` in your browser. To test offline behavior, first load `http://localhost:8000/?offline=1` while the server is running and wait for the service worker to install.

## Submit a pull request

Fork the repository, create a branch for your change, and open a pull request against `main`. Explain the change, link any related issue, and include screenshots for visible changes. Exercise the affected flow in a browser and describe what you checked. If the change affects saved workspace data, also check that an existing workspace or JSON backup still loads.

Run the automated tests with Node.js 24, the version used by GitHub Actions.

```sh
node --test
```

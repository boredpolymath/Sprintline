# Security Policy

## Report a vulnerability

Use [GitHub’s private vulnerability reporting form](https://github.com/boredpolymath/Sprintline/security/advisories/new). Include the affected commit or deployment, browser and version, reproduction steps, and the impact you observed. Use sample workspace data and keep vulnerability details out of public issues and pull requests.

## Scope

This policy covers the current `main` branch and the Sprintline deployment on GitHub Pages. Sprintline is a static browser app that stores workspace data in IndexedDB and uses a service worker to cache its app files.

Treat imported JSON as untrusted. Imported content should remain data, and an invalid backup should leave the existing workspace intact. The service worker should cache and serve only Sprintline’s app files within its registration scope. Reports should describe what data or behavior can be affected and what a user must do for the issue to occur.

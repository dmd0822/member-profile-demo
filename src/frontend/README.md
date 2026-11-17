# Member Services Frontend

This is the Angular 22 application project for the initial application
foundation. It contains only a neutral shell; member workflows and API
integrations belong to separately approved features.

Use Node.js 24.22.3 and the repository's approved internal npm feed. From this
directory, install the pinned dependencies and run the independent checks:

```powershell
npm ci
npm run build
npm test
```

Frontend tests live under `tests/unit/frontend/`, outside the application
source tree.

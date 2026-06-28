import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // Filled in after `npx sanity init` — see studio/README.md
    projectId: 'YOUR_PROJECT_ID',
    dataset: 'production',
  },
})

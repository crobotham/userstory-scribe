
# Welcome to SonicStories

## Project info

**URL**: https://lovable.dev/projects/a2f0d484-e021-42ff-9a3b-fb14fa86924d

## Deployment to Multiple Domains

This project supports deployment to multiple domains:
- Development: Local development environment
- Staging: https://staging.sonicstories.io
- Production: https://userstory-scribe.lovable.app

To deploy to a specific environment, run:
```sh
# For staging
node scripts/deploy.js staging

# For production
node scripts/deploy.js production
```

The deployment script will build the application with the correct environment variables and deploy to the appropriate domain.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a2f0d484-e021-42ff-9a3b-fb14fa86924d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a2f0d484-e021-42ff-9a3b-fb14fa86924d) and click on Share -> Publish.

Alternatively, use the deployment scripts as described in the "Deployment to Multiple Domains" section.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# Collab-Kanban

A real-time collaborative Kanban board — drag cards between columns and see it update instantly for everyone else looking at the same board, with live cursors and presence avatars showing who else is online.

**Live demo:** https://collab-kanban-omega.vercel.app (sign in with GitHub)

<!-- Add a screenshot or GIF of the board here, ideally showing two cursors/avatars at once -->

## Features

- **GitHub sign-in** (NextAuth / Auth.js)
- **Live cursors & presence** — see other connected users moving around the board in real time, with their name and avatar
- **Real-time Kanban board** — create, delete, and drag-and-drop cards between and within columns; every change syncs instantly to everyone else on the board
- **Persisted state** — the board's contents live in Liveblocks Storage, so refreshing doesn't lose anything

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [NextAuth (Auth.js)](https://authjs.dev) for GitHub OAuth
- [Liveblocks](https://liveblocks.io) for real-time presence and multiplayer storage
- [dnd-kit](https://dndkit.com) for drag-and-drop
- Deployed on [Vercel](https://vercel.com)

## Running it locally

1. Clone the repo and install dependencies:
   ```
   npm install
   ```
2. Create a GitHub OAuth App at https://github.com/settings/developers with:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Create a project at https://liveblocks.io/dashboard and grab its **secret key**.
4. Create a `.env.local` file in the project root:
   ```
   AUTH_SECRET=<generate with: npx auth secret>
   AUTH_GITHUB_ID=<your GitHub OAuth app client id>
   AUTH_GITHUB_SECRET=<your GitHub OAuth app client secret>
   LIVEBLOCKS_SECRET_KEY=<your Liveblocks secret key>
   ```
5. Run the dev server:
   ```
   npm run dev
   ```

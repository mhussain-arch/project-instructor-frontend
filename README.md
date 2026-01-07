# Frontend For Project Instructor

This is the frontend for project instructor build using Next.js

In order to set up this project, follow these steps:

```
pnpm i
```

To run:

```
pnpm run dev
```

Initial setup:

Create a .env.local file and add the following contents:

```
NEXT_PUBLIC_API_URL=http://localhost:4444 # NestJS Port (Refer to project instructor frontend)
AUTH_SECRET=super-secret-random-string # Run `npx auth secret` to generate
```
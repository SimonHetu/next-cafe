This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

```bash
npm install
```

Configurez votre fichier .env à partir du .env.exemple

Faites un compte Ngrok si ce n'est pas encore fait pour le configurer dans 'Getting Started' -> 'Setup & Installation' faites l'étape d'installation pour configurer votre auth token jusqu'à avoir votre l'adresse de votre domaine. Copier celui-ci.

Retournez Clerk, sur le dashboard du projet, rendez-vous à la section 'Configure' -> 'Developers' -> 'Webhooks' . Faites 'add Endpoint' et dans la case Endpoint URL collez votre adresse obtenue de ngrok. et ajoutez ' /api/webhooks ' à la suite. Sélectionnez les events 3 events de user dans la boite 'Subscribe to events' puis créez votre endpoint.
Sur la page de votre nouveau endpoint, vous trouverez le Signing Secret; ajoutez celui-ci à votre .env

Vous pouvez maintenant démarrer ngrok sur le port que vous utilisez (ici 3000) :

```bash
ngrok http 3000
```

Puis démarrez le projet :

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

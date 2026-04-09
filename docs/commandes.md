### Ajustement du schema Prisma
npx prisma format

### Générer le client Prisma (API DB)
npx prisma generate

### Appliquer le schema à la base de données
npx prisma migrate dev --name update

### Lancer l'application
npm run dev


---
### Seeds
npx prisma db seed
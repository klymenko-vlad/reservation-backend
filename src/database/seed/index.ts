import 'dotenv/config';
import { seedRbac } from './rbac.seed';

async function main() {
  await seedRbac();
}

main()
  .then(() => {
    console.log('✅ Seeding finished');
    process.exit(0);
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  });

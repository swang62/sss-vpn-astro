import { push, seed, seedProducts } from "@/db/seed";

await push();
await seed();
await seedProducts();

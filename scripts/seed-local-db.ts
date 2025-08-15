import { push, seed, syncProducts } from "@/db/seed";

await push();
await seed();
await syncProducts();

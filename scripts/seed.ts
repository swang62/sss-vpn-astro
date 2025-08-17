// !!! Must use relative imports and conditional imports !!!
import { deleteDB, migrate, seed, syncProducts } from "../src/db/seed";

await deleteDB();
await migrate();
await seed();
await syncProducts();

console.debug("Done.");

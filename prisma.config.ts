// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   engine: "classic",
//   datasource: {
//     url: env("DATABASE_URL") || "mysql://root:@localhost:3306/arsip",
//   },
// });

import { defineConfig } from "prisma/config";


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "mysql://bpkadksb_2g18:}}s%n65M0vGvSwvZ@localhost/bpkadksb_sipeka"!,
    // url: "mysql://root:@localhost:3306/simpeg_kesbangpol"!,
    
  },
});

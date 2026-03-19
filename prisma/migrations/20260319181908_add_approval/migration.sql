-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ToolUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ToolUser" ("createdAt", "email", "id") SELECT "createdAt", "email", "id" FROM "ToolUser";
DROP TABLE "ToolUser";
ALTER TABLE "new_ToolUser" RENAME TO "ToolUser";
CREATE UNIQUE INDEX "ToolUser_email_key" ON "ToolUser"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

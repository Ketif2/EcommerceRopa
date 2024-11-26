import { openDB } from "idb";

export const openDatabase = async () => {
  return await openDB("authDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("tokens")) {
        db.createObjectStore("tokens", { keyPath: "id" });
      }
    },
  });
};

export const storeTokens = async (accessToken, refreshToken) => {
  console.log("Tokens antes de almacenar:", { accessToken, refreshToken });
  const createdAt = new Date().getTime();
  const tokens = { id: 1, accessToken, refreshToken, createdAt };
  const db = await openDatabase();
  console.log("Guardando tokens en IndexedDB:", tokens); // Log de depuración
  await db.put("tokens", tokens);
};

export const getTokens = async () => {
  const db = await openDatabase();
  const tokens = await db.get("tokens", 1);
  console.log("Recuperando tokens de IndexedDB:", tokens); // Log de depuración
  if (!tokens) {
    console.warn("No se encontraron tokens en IndexedDB.");
  }
  return tokens;
};

export const clearTokens = async () => {
  const db = await openDatabase();
  console.log("Borrando tokens de IndexedDB"); // Log de depuración
  await db.delete("tokens", 1);
};

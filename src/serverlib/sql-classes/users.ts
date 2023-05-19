import crypto from "crypto";
import psqlQuery, { psqlInsert } from "@/serverlib/psql-conn";
import { randomId } from "@/sharedlib/essentials";

export default class UsersSQL {
  static async getById(id: string) {
    const data = (await psqlQuery("SELECT * FROM users WHERE id=$1", [
      id,
    ])) as any;

    return data[0];
  }

  static async getByUsername(username: string) {
    const data = (await psqlQuery(
      "SELECT * FROM users WHERE TRIM(BOTH ' ' FROM LOWER(username))=TRIM(BOTH ' ' FROM LOWER($1))",
      [username]
    )) as any;

    return data[0];
  }

  static async getByUsernameAndPassword(username: string, password: string) {
    const data = (await psqlQuery(
      `SELECT * FROM users WHERE TRIM(BOTH ' ' FROM LOWER("username"))=TRIM(BOTH ' ' FROM LOWER($1)) AND "password"=(SUBSTRING("password"::TEXT FROM 0 FOR 65) || encode(sha256(SUBSTRING("password"::BYTEA FROM 0 FOR 65) || $2), 'hex'));`,
      [username, password]
    )) as any;

    return data[0];
  }

  static async create(username: string, password: string, email?: string) {
    const newId = randomId();

    let hash = randomId(64);

    await psqlInsert("users", {
      id: newId,
      username,
      password: `${hash}${crypto
        .createHash("sha256")
        .update(hash + password)
        .digest("hex")}`,
      email,
      timecreated: Date.now(),
    });

    return newId;
  }
}

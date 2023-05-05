import crypto from "crypto";
import psqlQuery, {
  psqlDelete,
  psqlInsert,
  psqlUpdate,
} from "@/serverlib/psql-conn";
import { randomId } from "@/sharedlib/essentials";
import BoardType from "@/types/server/board/board";

export default class BoardsSQL {
  static async getById(id: string) {
    const data = (await psqlQuery("SELECT * FROM boards WHERE id=$1", [
      id,
    ])) as any;

    return data[0] as BoardType;
  }

  static async getByOwnerId(id: string) {
    const data = (await psqlQuery(
      "SELECT * FROM boards WHERE ownerid=$1 ORDER BY listorder",
      [id]
    )) as any;

    return data as BoardType[];
  }

  static async getLast(ownerid: string) {
    const data = (await psqlQuery(
      "SELECT * FROM boards WHERE ownerid=$1 ORDER BY listorder DESC",
      [ownerid]
    )) as any;

    return data[0]?.listorder as string | undefined;
  }

  static async setName(id: string, name: string) {
    await psqlUpdate(
      "boards",
      {
        name,
      },
      {
        id,
      }
    );
  }

  static async delete(id: string) {
    await psqlDelete("boards", {
      id,
    });
  }

  static async create(ownerid: string, name: string, listorder: number) {
    const newId = randomId();

    await psqlInsert("boards", {
      id: newId,
      ownerid,
      name,
      listorder,
      timecreated: Date.now(),
      timeupdated: Date.now(),
    });

    return newId;
  }

  static async decreaseBoardListOrders(ownerid: string, listorder: number) {
    await psqlQuery("UPDATE boards SET listorder = listorder -1 WHERE ownerid =$1 AND listorder > $2", [ownerid, listorder])
  }

}


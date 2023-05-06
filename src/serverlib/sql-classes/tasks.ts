import psqlQuery, {
  psqlDelete,
  psqlInsert,
  psqlInsertMultiple,
  psqlUpdate,
} from "@/serverlib/psql-conn";
import { randomId } from "@/sharedlib/essentials";
import TaskType from "@/types/server/board/task";

export default class TasksSQL {
  static async getById(id: string) {
    const data = (await psqlQuery("SELECT * FROM tasks WHERE id=$1", [
      id,
    ])) as any;

    return data[0] as TaskType;
  }

  static async getByOwnerId(ownerid: string) {
    const data = (await psqlQuery(
      "SELECT * FROM tasks WHERE ownerid=$1 ORDER BY listorder",
      [ownerid]
    )) as any;

    return data as TaskType[];
  }

  static async getLast(ownerid: string) {
    const data = (await psqlQuery(
      "SELECT * FROM tasks WHERE ownerid=$1 ORDER BY listorder DESC",
      [ownerid]
    )) as any;

    return data[0]?.listorder as string | undefined;
  }

  static async delete(id: string) {
    await psqlDelete("tasks", { id });
  }

  static async setText(id: string, text: string) {
    await psqlUpdate(
      "tasks",
      {
        text,
      },
      {
        id,
      }
    );
  }

  static async setUpdatedBy(id: string, updatedby: string) {
    await psqlUpdate(
      "tasks",
      {
        updatedby,
      },
      {
        id,
      }
    );
  }

  static async setLastChecked(
    id: string,
    lastchecked: number,
    lastcheckedby: string
  ) {
    await psqlUpdate(
      "tasks",
      {
        lastchecked,
        lastcheckedby,
      },
      {
        id,
      }
    );
  }

  static async setChecked(id: string, checked: boolean) {
    await psqlUpdate(
      "tasks",
      {
        checked,
      },
      {
        id,
      }
    );
  }

  static async createMultiple(
    ownerid: string,
    updatedby: string,
    tasks: TaskType[]
  ) {
    const newId = randomId();

    await psqlInsertMultiple(
      "tasks",
      tasks.map((task, index) => ({
        ...task,
        id: randomId(),
        ownerid,
        timecreated: Date.now(),
        timeupdated: Date.now(),
        lastchecked: undefined,
        lastcheckedby: undefined,
        updatedby,
        listorder: index,
      }))
    );

    return newId;
  }

  static async create(ownerid: string, updatedby: string, listorder: number) {
    const newId = randomId();

    await psqlInsert("tasks", {
      id: newId,
      ownerid,
      text: "",
      checked: false,
      timecreated: Date.now(),
      timeupdated: Date.now(),
      updatedby,
      listorder,
    });

    return newId;
  }
  static async decreaseTaskListOrders(ownerid: string, listorder: number) {
    await psqlQuery(
      "UPDATE tasks SET listorder = listorder -1 WHERE ownerid =$1 AND listorder > $2",
      [ownerid, listorder]
    );
  }
}

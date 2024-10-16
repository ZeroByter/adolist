import { Timestamp } from "firebase/firestore";
import TaskType from "./task";

type BoardType = {
  ownerId: string;
  name: string;
  listOrder: number;
  timeCreated: Timestamp;
  timeUpdated: Timestamp;
  shares: string[];
  tasks: TaskType[];
};

export default BoardType;

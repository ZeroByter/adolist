import { Timestamp } from "firebase/firestore";

type TaskType = {
  id: string;
  ownerId: string;
  text: string;
  checked: boolean;
  timeCreated: Timestamp;
  timeUpdated: Timestamp;
  updatedBy: string;
  listOrder: number;
  lastChecked: Timestamp;
  lastCheckedBy: string;
};

export default TaskType;

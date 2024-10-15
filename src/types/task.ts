import { DocumentReference, Timestamp } from "firebase/firestore"
import UserDataType from "./user"

type TaskType = {
  ownerRef: DocumentReference<UserDataType>;
  text: string;
  checked: boolean;
  timeCreated: Timestamp;
  timeUpdated: Timestamp;
  updatedBy: DocumentReference<UserDataType>;
  listOrder: number;
  lastChecked: Timestamp;
  lastCheckedBy: DocumentReference<UserDataType>;
}

export default TaskType

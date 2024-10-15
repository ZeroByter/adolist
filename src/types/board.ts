import { DocumentReference, DocumentSnapshot, Timestamp } from "firebase/firestore";
import UserDataType from "./user";
import TaskType from "./task";

type BoardType = {
  ownerRef: DocumentReference<UserDataType>;
  name: string;
  listOrder: number;
  timeCreated: Timestamp;
  timeUpdated: Timestamp;
  shares: DocumentReference<UserDataType>[];
  tasks: TaskType[];
}

export default BoardType

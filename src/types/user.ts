import { Timestamp } from "firebase/firestore";

type UserDataType = {
  displayName: string;
  searchableName: string[];
  timeCreated: Timestamp;
};

export default UserDataType;

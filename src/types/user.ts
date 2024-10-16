import { Timestamp } from "firebase/firestore";

type UserDataType = {
  displayName: string;
  displayNameL: string;
  timeCreated: Timestamp;
};

export default UserDataType;

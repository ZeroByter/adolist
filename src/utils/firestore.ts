import UserDataType from "@/types/user";
import { collection, CollectionReference, doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "./firebase";
import BoardType from "@/types/board";

const firestoreDb = getFirestore(firebaseApp);

type CollectionTypes = {
  "users": UserDataType;
  "boards": BoardType;
}

const nestedDocumentPaths: { [key in keyof CollectionTypes]?: string } = {
  // userPosts: "users/$/userPosts"
}

const processRawNestedDocumentPath = (documentPath: string, args: any[]) => {
  let result = documentPath

  for (const arg of args) {
    result = result.replace("$", arg)
  }

  return result
}

type CollectionsTypesNames = keyof CollectionTypes;
const getCollection = <CName extends CollectionsTypesNames>(collectionName: CName, ...nestedPathArgs: any[]) => {
  if (collectionName in nestedDocumentPaths) {
    const nestedPath = processRawNestedDocumentPath(nestedDocumentPaths[collectionName] as string, nestedPathArgs)

    return collection(firestoreDb, nestedPath) as CollectionReference<CollectionTypes[CName]>
  }

  return collection(firestoreDb, collectionName) as CollectionReference<CollectionTypes[CName]>
};

// getDoc(doc(getCollection("users"), 'test')).then(doc => {
//   doc.data()?.displayName
// })

export default getCollection
'use client'

import UserDataType from "@/types/user";
import getCollection from "@/utils/firestore";
import { addDoc, doc, getDoc, onSnapshot, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";


export default function Home() {
  const [docs, setDocs] = useState<QueryDocumentSnapshot<UserDataType>[]>([])

  useEffect(() => {
    const unsub = onSnapshot(getCollection("users"), (snap) => {
      setDocs(snap.docs)
    });

    return () => unsub()
  }, [])

  const handleClick = async () => {
    try {
      // const docRef = await addDoc(getCollection("users"), {
      //   test_key: "test_value"
      // });
      // console.log("Document written with ID: ", docRef.id);

      // addDoc(getCollection("boards"), {
      //   ownerRef: doc(getCollection("users"), "J6r1Dkj9xaQmrZ679Sln"),
      //   name: "some board",
      //   listOrder: 0,
      //   timeCreated: Timestamp.now(),
      //   timeUpdated: Timestamp.now(),
      //   shares: [],
      //   tasks: [
      //     {
      //       ownerRef: doc(getCollection("users"), "J6r1Dkj9xaQmrZ679Sln"),
      //       text: "some text",
      //       checked: false,
      //       timeCreated: Timestamp.now(),
      //       timeUpdated: Timestamp.now(),
      //       updatedBy: doc(getCollection("users"), "J6r1Dkj9xaQmrZ679Sln"),
      //       listOrder: 0,
      //       lastChecked: Timestamp.now(),
      //       lastCheckedBy: doc(getCollection("users"), "J6r1Dkj9xaQmrZ679Sln")
      //     }
      //   ]
      // })
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const renderDocs = docs.map(doc => {
    return <div key={doc.id}>{doc.data().displayName}</div>
  })

  return (
    <div>
      <button onClick={handleClick}>pls click me</button>

      <div>
        {renderDocs}
      </div>
    </div>
  );
}

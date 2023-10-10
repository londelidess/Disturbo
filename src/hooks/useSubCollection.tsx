import React, { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    CollectionReference,
    DocumentData,
    DocumentReference,
    FieldValue,
    Firestore,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {  useAppSelector } from "../app/hooks";


interface Messages {
    timestamp: Timestamp;
    message: string;
    user: {
      uid: string;
      photo: string;
      email: string;
      displayName: string;
    };
  }

const useSubCollection = (
    collectionName:string,
    subCollectionName: string
    )=> {
  const [subDocuments, setSubDocuments] = useState<Messages[]>([]);
  const channelId = useAppSelector((state) => state.channel.channelName);

  useEffect(() => {
    let collectionRef = collection(
      db,
      collectionName,
      String(channelId),
      subCollectionName
    );

    const collectionRefOrderBy = query(
      collectionRef,
      orderBy("timestamp", "desc")
    );

    onSnapshot(collectionRefOrderBy, (snapshot) => {
        let results: Messages[] = [];
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          results.push({
            timestamp: doc.data().timestamp,
            message: doc.data().message,
            user: doc.data().user,
          });
        });
        setSubDocuments(results);
      });
    }, [channelId]);
    return { subDocuments };
  };

  export default useSubCollection;
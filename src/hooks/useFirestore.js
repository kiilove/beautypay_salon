import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

export function useFirestoreQuery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);

  // 데이터 가져오기 함수 (페이징 및 실시간 구독 지원)
  async function getDocuments(
    collectionName,
    callback = null,
    {
      conditions = [],
      orderByField = "",
      orderByDirection = "asc",
      limitNumber = 0,
      page = 1,
      realTime = false,
    } = {}
  ) {
    setLoading(true);
    setError(null);

    let q = collection(db, collectionName);

    // 조건 추가
    conditions.forEach((condition) => {
      q = query(q, where(...condition));
    });

    // 정렬 및 제한 추가
    if (orderByField) q = query(q, orderBy(orderByField, orderByDirection));
    if (limitNumber) q = query(q, limit(limitNumber));

    // 페이지 시작점을 계산하여 startAfter 적용
    if (page > 1) {
      const offset = (page - 1) * limitNumber;
      // Firestore의 startAfter는 문서 기준이므로, offset에 맞게 문서를 가져온 후 설정합니다.
      const snapshot = await getDocs(query(q, limit(offset)));
      if (snapshot.docs.length > 0) {
        q = query(q, startAfter(snapshot.docs[snapshot.docs.length - 1]));
      }
    }

    // 실시간 구독 또는 단발성 쿼리 실행
    if (realTime) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(documents);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          if (callback) callback(documents);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setError(error);
          setLoading(false);
        }
      );

      // 컴포넌트 언마운트 시 구독 해제
      return unsubscribe;
    } else {
      try {
        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(documents);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        if (callback) callback(documents);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }

  return {
    data,
    loading,
    error,
    getDocuments,
    lastVisible,
  };
}

export function useFirestoreGetDocument() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getDocument(collectionName, id, callback = null) {
    try {
      setLoading(true);
      setError(null);
      const docSnapshot = await getDoc(doc(db, collectionName, id));
      if (docSnapshot.exists()) {
        const documentData = { id: docSnapshot.id, ...docSnapshot.data() };
        setData(documentData);
        if (callback) callback(documentData);
      } else {
        setError("Document does not exist");
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    getDocument,
  };
}

export function useFirestoreAddData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function addData(collectionName, newData, callback = null) {
    try {
      setLoading(true);
      setError(null);
      const docRef = await addDoc(collection(db, collectionName), newData);
      const addedData = { ...newData, id: docRef.id };
      setData(addedData);
      if (callback) callback(addedData);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, addData };
}

export function useFirestoreUpdateData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateData(collectionName, id, newData, callback = null) {
    try {
      setLoading(true);
      setError(null);
      await updateDoc(doc(db, collectionName, id), newData);
      const updatedData = { ...newData };
      setData(updatedData);
      if (callback) callback(updatedData);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, updateData };
}

export function useFirestoreDeleteData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function deleteData(collectionName, id, callback = null) {
    try {
      setError(null);
      await deleteDoc(doc(db, collectionName, id));
      setData(id);
      if (callback) callback(id);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  return { data, error, deleteData };
}

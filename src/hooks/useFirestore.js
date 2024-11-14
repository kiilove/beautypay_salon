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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 전체 문서 수 가져오기
  async function getDocumentCount(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.size;
    } catch (error) {
      console.error("Error fetching document count:", error);
      setError(error);
      return 0;
    }
  }

  // 데이터 가져오기 함수
  async function getDocuments(
    collectionName,
    callback = null,
    {
      conditions = [],
      orderByField = "",
      orderByDirection = "asc",
      limitNumber = 0,
      page = 1,
    } = {}
  ) {
    setLoading(true);
    setError(null);

    try {
      let baseQuery = collection(db, collectionName);
      let queryConstraints = [];

      // 조건 추가
      conditions.forEach((condition) => {
        queryConstraints.push(where(...condition));
      });

      // 정렬 추가
      if (orderByField) {
        queryConstraints.push(orderBy(orderByField, orderByDirection));
      }

      // 페이지네이션을 위한 쿼리 구성
      if (page > 1 && limitNumber > 0) {
        // 이전 페이지의 마지막 문서를 가져오기
        const previousPageQuery = query(
          baseQuery,
          ...queryConstraints,
          limit((page - 1) * limitNumber)
        );
        const previousPageSnapshot = await getDocs(previousPageQuery);
        const lastVisible =
          previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];

        // 현재 페이지 쿼리에 startAfter 추가
        queryConstraints.push(startAfter(lastVisible));
      }

      // 페이지 크기 제한 추가
      if (limitNumber > 0) {
        queryConstraints.push(limit(limitNumber));
      }

      // 최종 쿼리 실행
      const finalQuery = query(baseQuery, ...queryConstraints);
      const querySnapshot = await getDocs(finalQuery);

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (callback) {
        callback(documents);
      }

      return documents;
    } catch (error) {
      console.error("Error in getDocuments:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getDocuments,
    getDocumentCount,
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

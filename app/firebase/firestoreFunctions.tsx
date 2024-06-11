import firebase from 'firebase/app';
import 'firebase/firestore';
import {
    Firestore,
    QueryDocumentSnapshot,
    DocumentData,
    collection,
    getDocs,
    addDoc,
    doc, 
    updateDoc,
    query,
    where,
    getDoc,
    DocumentReference
  } from "firebase/firestore";
import { db } from "./config";

interface Item {
    id: string;
    [key: string]: any;
  }

  export async function readDataFromFirestoreByValue(collectionName: string, fieldName: string, value: string): Promise<Item[]> {
    try {
        
        let q = query(collection(db, collectionName), where(fieldName, "==", value.toString()));

        if(value === "true"){
            q = query(collection(db, collectionName), where(fieldName, "==", true));
        }else if(value === "true"){
            q = query(collection(db, collectionName), where(fieldName, "==", false));
        }

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const items = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Item[];

            return items;
        } else {
            throw new Error(`No documents found in ${collectionName} for the provided ${fieldName} and value ${value}`);
        }
    } catch (error) {
        console.error('Error reading data from Firestore:', error);
        throw error;
    }
}

export async function getVisibleFarmsWithCrop(crop: string): Promise<Item[] | undefined> {
    try {
        const q = query(collection(db, "farm"), where("visible", "==", true));
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const items = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Item[];

            if(crop == "Filter By Crop"){
                return items;
            }else{
                const filteredItems = items.filter((item) => item.crops.includes(crop));
                return filteredItems;
            }
            
        }
        return [] as Item[]; // Add a return statement for the case when querySnapshot is empty
    } catch (error) {
        console.error('Error reading data from Firestore:', error);
        throw error;
    }
}

export async function readDataFromFirestore(collectionName: string): Promise<Item[]> {
    try {
       const querySnapshot = await getDocs(collection(db, collectionName));
       const docSnapshot = querySnapshot.docs[0];
        if (docSnapshot) {
            const items = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
              })) as Item[];
            return items;
        } else {
            throw new Error('Document does not exist');
        }
    } catch (error) {
        console.error('Error reading data from Firestore:', error);
        throw error;
    }
}

export async function createDocument(collectionName: string, data: DocumentData) {
    try {
        const userCollection = collection(db, collectionName);
        return await addDoc(userCollection, data);
    } catch (error) {
        console.error('Error creating document on Firestore:', error);
        throw error;
    }
}

export async function updateRecord(collectionName: string, data: DocumentData, docId: string) {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error('Error updating document on Firestore:', error);
        throw error;
    }
}

/**
 * Updates a document in Firestore by a specific field.
 * @param collectionName - The name of the collection where the document is located.
 * @param data - The data to update the document with.
 * @param fieldName - The name of the field to match.
 * @param fieldId - The value of the field to match.
 * @returns {Promise<void>} - A promise that resolves when the document is successfully updated.
 * @throws {Error} - If there is an error updating the document.
 */
export async function updateRecordByField(collectionName: string, data: DocumentData, fieldName: string, fieldId: string): Promise<void> {
    try {
        // Get the document reference for the collection where fieldName = fieldId
        const querySnapshot = await getDocs(collection(db, collectionName));
        const docRef = querySnapshot.docs.find(doc => doc.data()[fieldName] === fieldId);

        if (!docRef) {
            throw new Error(`Document not found in collection ${collectionName} where ${fieldName} = ${fieldId}`);
        }

        await updateDoc(docRef.ref, data);
    } catch (error) {
        console.error('Error updating document on Firestore:', error);
        throw error;
    }
}


export async function assignFarmToUser(userid: string, farmRef: DocumentReference<unknown, DocumentData>): Promise<void> {
    try {

        const querySnapshot = await getDocs(collection(db, "user"));
        const userDocRef = querySnapshot.docs.find(doc => doc.data()["userid"] === userid);
        
        if (!userDocRef) {
            throw new Error(`User document not found for user id ${userid}`);
        }

        const userFarmData = {
            farm: farmRef
        };
        await updateDoc(userDocRef.ref, userFarmData);
    } catch (error) {
        console.error('Error assigning farm to user:', error);
        throw error;
    }
}

export async function getDocument(docRef: DocumentReference<unknown, DocumentData>) {
    
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  }
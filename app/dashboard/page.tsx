"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import Menu from "../components/Menu";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "firebase/firestore";
import {  getDocument, readDataFromFirestoreByValue } from "../firebase/firestoreFunctions";

interface Farm {
  id: string;
  [key: string]: any;
}

interface Item {
  id: string;
  farm:Farm;
  [key: string]: any;
}


export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();


  console.log({ user });

  useEffect(() => {
    if (!user) {
      router.push("/");
    }else{
      sessionStorage.setItem("userid", user.uid);
      const fetchData = async () => {
        const items = await readDataFromFirestoreByValue("user", "userid", user.uid) as unknown as Item;
        if (items[0].farm) {
          const farmDocument = await getDocument(items[0].farm) as Farm;  // Await the getDocument function call
          sessionStorage.setItem("farm_name", farmDocument.name)
          sessionStorage.setItem("farm_phone", farmDocument.phone)

          sessionStorage.setItem("farm_address", farmDocument.address)
          sessionStorage.setItem("visible", farmDocument.visible)
          sessionStorage.setItem("crops", farmDocument.crops)
          sessionStorage.setItem("farm_id", items[0].farm.id)
        } else {
          console.log(`farm not found `);
        }
        router.push("/farm");
      };

      fetchData();
    }
    
    
  }, [user, router]);

  return (
    <div className="flex-on-desktop">
      <Menu/>
      <main className="flex-grow">
      <Dashboard/>
      </main>
    </div>
  );
}

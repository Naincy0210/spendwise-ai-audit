import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { AuditResult, Lead } from '../types';

import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function saveAuditResult(result: AuditResult): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'audits'), result);
    return docRef.id;
  } catch (error) {
    console.error("Firebase save failed, using local storage:", error);
    const id = result.id || crypto.randomUUID();
    localStorage.setItem(`audit_${id}`, JSON.stringify(result));
    return id;
  }
}

export async function getAuditResult(id: string): Promise<AuditResult | null> {
  try {
    const docRef = doc(db, 'audits', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AuditResult;
    }
  } catch (error) {
    console.error("Firebase get failed, checking local storage:", error);
  }
  
  const local = localStorage.getItem(`audit_${id}`);
  return local ? JSON.parse(local) : null;
}

export async function captureLead(lead: Lead): Promise<void> {
  try {
    await addDoc(collection(db, 'leads'), {
      ...lead,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Firebase lead capture failed:", error);
    const leads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
    leads.push(lead);
    localStorage.setItem('pending_leads', JSON.stringify(leads));
  }
}

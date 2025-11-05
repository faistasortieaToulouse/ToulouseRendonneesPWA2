'use client';

// SEULS les imports Firestore sont conservés. Tous les imports Firebase Auth sont supprimés.
import { doc, serverTimestamp, getFirestore, collection, query, where, getDocs, limit, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
// setDocumentNonBlocking est conservé car il gère l'écriture Firestore
import { setDocumentNonBlocking } from '../non-blocking-updates'; 

// NOTE IMPORTANTE DE SÉCURITÉ (À FAIRE CÔTÉ SERVEUR !) :
// Dans une application réelle, le hachage des mots de passe (avec bcrypt ou Argon2) 
// doit être effectué sur un serveur sécurisé (ex: Next.js API Routes, Cloud Functions) 
// et non côté client, comme c'est le cas ici.
// Pour cette démonstration, nous simulons l'enregistrement direct.

interface SignUpData {
  email: string;
  password?: string;
  identite: string;
  genre: 'Femme' | 'Homme' | 'Autre';
  etudiant: boolean;
  majeur: boolean;
}

/**
 * Enregistre un nouvel utilisateur directement dans la collection 'users' de Firestore.
 * Cette fonction NE CRÉE PAS de compte Firebase Authentication.
 * * @param data Les données d'inscription de l'utilisateur.
 * @returns Le profil utilisateur créé.
 */
export async function signUpUserToDatabase({ 
  email, 
  password, 
  identite, 
  genre, 
  etudiant, 
  majeur 
}: SignUpData): Promise<any> {
  if (!password) {
    throw new Error("Le mot de passe est requis pour l'inscription.");
  }
  
  const firestore = getFirestore(getApp());

  // 1. Vérifier si l'identifiant existe déjà
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where("identite", "==", identite), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error("Cet identifiant est déjà utilisé par un autre membre.");
  }
  
  // 2. Générer un UID temporaire pour le document (puisque Firebase Auth.user.uid n'est plus disponible)
  // En production, il est préférable d'utiliser l'ID généré par Firestore pour le doc ou un ID basé sur le hachage.
  const tempUserId = doc(usersRef).id;

  // 3. HACHER LE MOT DE PASSE ICI (Doit être fait de manière sécurisée et idéalement côté serveur)
  const hashedPassword = password; // REMPLACER CECI par le hachage réel (ex: bcrypt(password))

  const userProfile = {
    // IMPORTANT: Stockage du mot de passe HACHÉ pour la vérification future
    password: hashedPassword, 
    email: email,
    identite: identite,
    genre: genre,
    etudiant: etudiant,
    majeur: majeur,
    role: 'Membre',
    photoURL: `https://picsum.photos/seed/${tempUserId}/100/100`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    recommandation: "être bien équipé",
  };
  
  // 4. Créer le document utilisateur dans Firestore
  const userRef = doc(firestore, 'users', tempUserId);
  
  // Utilisation de l'écriture non bloquante pour les mises à jour optimistes de l'interface utilisateur
  // On utilise setDoc ici pour garantir que le document est créé avec l'ID généré
  setDocumentNonBlocking(userRef, userProfile, { merge: true });

  // Retourner le profil utilisateur (sans le mot de passe HACHÉ)
  const { password: _, ...profileWithoutPassword } = userProfile;
  return profileWithoutPassword;
}

// -----------------------------------------------------------------------------------
// La fonction signInWithIdentifier n'est plus nécessaire ici.
// Sa logique de connexion à la base de données est désormais directement intégrée 
// dans src/app/(auth)/login/page.tsx (via signInWithDatabase) pour plus de simplicité.
// Si vous aviez d'autres fonctions d'assistance liées uniquement à Firestore, elles iraient ici.
// -----------------------------------------------------------------------------------

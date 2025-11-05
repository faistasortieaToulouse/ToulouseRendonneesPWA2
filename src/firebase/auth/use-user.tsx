'use client'

import { useState, useEffect, useContext, createContext } from 'react';
// Suppression des imports de 'firebase/auth' et de '@/firebase/provider'
// La gestion de l'utilisateur est maintenant entièrement personnalisée.

// --- 1. Interface Utilisateur (Basée sur les données Firestore) ---

/**
 * Définit la structure du profil utilisateur stocké dans Firestore.
 */
export interface UserProfile {
    // Les champs du profil utilisateur de notre collection 'users' / 'adhesion'
    email: string;
    identite: string;
    role: 'Membre' | 'Admin'; // Exemple
    genre: 'Femme' | 'Homme' | 'Autre';
    etudiant: boolean;
    majeur: boolean;
    // ... autres champs comme photoURL, createdAt, updatedAt
    // L'ID unique du document Firestore (simulant le UID)
    uid: string; 
}

// --- 2. Contexte Utilisateur Personnalisé (Simulation de Session) ---

interface UserContextValue {
    // L'utilisateur connecté, ou null s'il n'est pas connecté
    user: UserProfile | null; 
    // État de chargement initial de la session (lecture du token/cookie)
    isUserLoading: boolean;
    // Erreur de session ou de chargement de l'utilisateur
    userError: Error | null; 
    // Méthode pour définir manuellement l'utilisateur après une connexion réussie dans Firestore
    setUser: (user: UserProfile | null) => void;
}

// Création d'un contexte avec des valeurs par défaut pour les consommateurs (le hook)
const UserContext = createContext<UserContextValue>({
    user: null,
    isUserLoading: true, // Par défaut, en cours de chargement
    userError: null,
    setUser: () => {} // Fonction vide par défaut
});

/**
 * NOTE SUR UserProvider :
 * Pour que ce hook fonctionne dans toute l'application, un composant 
 * <UserProvider> DOIT être créé et envelopper la racine de votre application.
 * Ce Provider serait responsable de lire le jeton de session stocké (cookie/local storage)
 * et de définir l'état 'user' au démarrage.
 */


// --- 3. Hook Personnalisé ---

/**
 * Hook personnalisé pour accéder à l'état de la session utilisateur.
 * @returns {UserContextValue} L'état de l'utilisateur actuel.
 */
export const useUser = () => {
    // Dans une application réelle, ceci lirait le UserContext
    // const context = useContext(UserContext);
    
    // Pour l'instant, nous renvoyons un état simulé pour éviter une erreur de compilation du Context
    // Dans votre implémentation réelle, ceci doit lire le contexte ci-dessus.
    
    // Simulation simple de l'état (À REMPLACER par l'appel `useContext(UserContext)`)
    const [user, setUserState] = useState<UserProfile | null>(null);
    const [isUserLoading, setIsLoading] = useState(false);
    const [userError, setUserError] = useState<Error | null>(null);

    // Retournez l'état simulé ou le contexte réel une fois le Provider câblé
    return {
        user: user,
        isUserLoading: isUserLoading,
        userError: userError,
        // La fonction `setUser` doit être utilisée par le LoginPage pour mettre à jour l'état global
        // Une fois que l'utilisateur est trouvé dans Firestore.
        // C'est cette fonction qui devrait venir du contexte réel.
        setUser: setUserState 
    };
};

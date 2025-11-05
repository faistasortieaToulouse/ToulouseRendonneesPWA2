"use client"

import { useState } from "react"
// Remplacement des imports Next.js par des composants génériques ou suppression
// import Link from "next/link" 
// import { useRouter } from "next/navigation"

// Utilisation des fonctions Firebase génériques (pour rendre le code autonome)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Import du composant SocialLoginButtons (réintégré)
import SocialLoginButtons from "@/components/app/SocialLoginButtons"

// --- Configuration Firebase MINIMALE et INITIALISATION ---
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// NOTE SUR LA SÉCURITÉ: Cette logique de connexion s'exécute côté client.
// La vérification des mots de passe (étape 2) devrait idéalement être gérée côté serveur.
async function signInWithDatabase(identite: string, password: string): Promise<any> {
    const ADHESION_COLLECTION_PATH = 'adhesion'; // Votre nom de collection
    
    // Simuler le chemin de la collection basée sur les règles de sécurité Firestore
    const adhesionRef = collection(db, ADHESION_COLLECTION_PATH);

    // 1. Rechercher l'utilisateur par son identifiant
    const q = query(adhesionRef, where("identite", "==", identite));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Simuler une erreur de connexion
        throw new Error("authentication/user-not-found");
    }

    const userData = querySnapshot.docs[0].data();
    
    // 2. Vérification du mot de passe (SIMPLIFIÉE ET NON SÉCURISÉE POUR LA DÉMO)
    // REMPLACER `userData.password` par le hash sécurisé dans votre implémentation réelle !
    if (password !== userData.password) { 
        throw new Error("authentication/wrong-password");
    }
    
    // 3. Succès de la connexion
    return userData;
}


export default function LoginPage() {
  const [identite, setIdentite] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("") 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const user = await signInWithDatabase(identite, password) 
      
      // Si la connexion réussit (l'utilisateur est trouvé dans la collection 'adhesion')
      setSuccess(`Connexion réussie ! Bienvenue, ${user.identite}. (Redirection vers le tableau de bord simulée)`)
    } catch (err: any) {
      // Gestion des erreurs provenant de votre nouvelle fonction
      let friendlyMessage = "L'identifiant ou le mot de passe est incorrect.";
      console.error("Erreur de connexion personnalisée:", err); 

      if (err.message.includes("not-found") || err.message.includes("wrong-password")) {
          // Message générique pour des raisons de sécurité
      } else {
        friendlyMessage = "Une erreur inconnue s'est produite lors de la connexion."
      }
      
      setError(friendlyMessage)
    }
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>
          Entrez votre identifiant ci-dessous pour vous connecter à votre compte (via Firestore)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de connexion</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
             <Alert className="border-green-500 bg-green-50/50 text-green-700">
               <AlertCircle className="h-4 w-4 text-green-600" />
               <AlertTitle>Succès</AlertTitle>
               <AlertDescription>{success}</AlertDescription>
             </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="identite">Identifiant</Label>
            <Input
              id="identite"
              type="text"
              placeholder="Votre pseudo"
              required
              value={identite}
              onChange={(e) => setIdentite(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
              {/* Utilisation de <a> à la place de <Link> */}
              <a
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Mot de passe oublié ?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>

          {/* Section Social Login RÉINTÉGRÉE */}
          <div className="relative my-2">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-card px-2 text-muted-foreground">
                 Ou continuer avec
               </span>
             </div>
          </div>
          <SocialLoginButtons />
          {/* FIN Section Social Login RÉINTÉGRÉE */}

        </form>
        <div className="mt-4 text-center text-sm">
          Vous n'avez pas de compte ?{" "}
          {/* Utilisation de <a> à la place de <Link> */}
          <a href="/signup" className="underline">
            S'inscrire
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

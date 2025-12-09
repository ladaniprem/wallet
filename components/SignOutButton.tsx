// import { styles } from '@/assets/styles/home.styles'
// import { COLORS } from '@/constants/colors'
// import { useClerk } from '@clerk/clerk-expo'
// import Ionicons from '@expo/vector-icons/Ionicons'
// import { useRouter } from 'expo-router'
// import { Alert, TouchableOpacity } from 'react-native'

// export const SignOutButton = () => {
//   // Use `useClerk()` to access the `signOut()` function
//   const { signOut } = useClerk()
//   const router = useRouter()

//   // const handleSignOut = async () => {
//   //   try {
//   //      await signOut()
//   //     // Redirect to your desired page
//   //     router.replace('/')
//   //   } catch (err) {
//   //     // See https://clerk.com/docs/guides/development/custom-flows/error-handling
//   //     // for more info on error handling
//   //     console.error(JSON.stringify(err, null, 2))
//   //     console.warn('Sign out failed', err)
//   //   }

//   const handleSignOut = async () => {
//     Alert.alert("Logout", "Are you sure you want to sign out?", [
//       {
//         text: "Cancel", style: "cancel"
//       },
//       {
//         text: "Sign Out",
//         style: "destructive",
//         onPress: () => {
//           // Call signOut and then navigate back to auth stack.
//           // Use promise chain to avoid unhandled async in Alert callback.
//           Promise.resolve()
//             .then(() => signOut())
//             .catch(() => { })
//             .finally(() => {
//               router.replace('/(auth)/sign-in')
//             })
//         }
//       }
//     ])
//   }

//   return (
//     <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
//       <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
//       {/* <Text>Sign out</Text> */}
//     </TouchableOpacity>
//   )
// }

import { useClerk } from "@clerk/clerk-expo";
import { Alert,TouchableOpacity } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => { void signOut(); } },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};

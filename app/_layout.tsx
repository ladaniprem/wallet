import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
let tokenCache: any = undefined;
if (Platform.OS !== "web") {
  try {
    // hide require from bundlers so they don't statically include native modules eslint-disable-next-line @typescript-eslint/no-implied-eval
    const req: any = eval("require");
    tokenCache = req("@clerk/clerk-expo/token-cache").tokenCache;
  } catch { }
}
export default function RootLayout() {
  const SafeScreenAny = SafeScreen as any;

  return (
    <ClerkProvider
      tokenCache={tokenCache}>
      <SafeScreenAny>
        <Slot />
      </SafeScreenAny>
      <StatusBar style="auto" />
    </ClerkProvider>
  )
}
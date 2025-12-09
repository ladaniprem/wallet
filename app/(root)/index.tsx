import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl, Alert } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import { styles } from "@/assets/styles/home.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import NoTransactionsFound from "@/components/NoTransactionsFound";
//export const API_URL = "http://localhost:5000/api";

// type TransactionItemProps = {
//   item: {
//     id: string | number;
//     amount?: number;
//     category?: string;
//     title?: string;
//     created_at?: string | Date;
//     [key: string]: any;
//   };
//   onDelete: (id: string | number) => void;
// };
export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  // Guest mode: if no Clerk user, use a stable public guest id
  const effectiveUserId = user?.id ?? "guest_public";
  const isGuest = !user?.id;
  const { transactions, summary, loadData, isLoading, deleteTransaction } = useTransactions(effectiveUserId);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
      setRefreshing(true);
      await loadData();
      setRefreshing(false);
    };
  const handleDelete = async (id: string | number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTransaction(String(id));
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }
  // console.log("Transactions:", transactions);
  // console.log("Summary:", summary);
  // console.log("User ID:", effectiveUserId, isGuest ? "(guest)" : "");
  //console.log("Is Loading:", isLoading);

  return (
    <>
      {/* <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text>Income:{summary.income}</Text>
        <Text>expense:{summary.expenses}</Text>
        <Text>balance:{summary.balance}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </SignedOut> */}
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header section */}
          <View style={styles.header}>
            {/* Left side of the header */}
            <View style={styles.headerLeft}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
            {/* Welcome */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {isGuest
                  ? "Guest"
                  : user?.emailAddresses?.[0]?.emailAddress?.split?.("@")?.[0] ?? "User"}
              </Text>
            </View>
            {/* Right side of the header */}
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  isGuest ? router.push("/(auth)/sign-in") : router.push("/(root)/create")
                }
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <SignOutButton />
            </View>
          </View>

          <BalanceCard summary={summary} />
          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.sectionTitle}> Recent Transactions</Text>
          </View>
          <FlatList
            style={styles.transactionsList}
            contentContainerStyle={styles.transactionsListContent}
            data={transactions}
            renderItem={({ item }) => (
              <TransactionItem item={item as any} onDelete={handleDelete} />
            )}
            ListEmptyComponent={<NoTransactionsFound />}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </View>
      </View>
    </>
  );
}
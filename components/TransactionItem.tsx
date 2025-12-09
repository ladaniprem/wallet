import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { formatDate } from "../lib/utils";

// Map categories to their respective icons
const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
};

type Transaction = {
  id: string | number;
  amount: string | number;
  category: keyof typeof CATEGORY_ICONS | string;
  title: string;
  created_at: string | Date;
};

type TransactionItemProps = {
  item: Transaction;
  onDelete: (id: string | number) => void;
};

export const TransactionItem = ({ item, onDelete }: TransactionItemProps) => {
  const isIncome = parseFloat(String(item.amount)) > 0;
  const iconName: keyof typeof Ionicons.glyphMap =
    CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS] || "pricetag-outline";

  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}
          >
            {isIncome ? "+" : "-"}₹{Math.abs(parseFloat(String(item.amount))).toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};

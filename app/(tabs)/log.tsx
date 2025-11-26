import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  SectionList, // Make sure this is imported
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons"; // Make sure Ionicons is imported
import { LinearGradient } from "expo-linear-gradient";
import { useHealth } from "../../hooks/useHealth";
import { MealLog, MealItem } from "../../types/health";
import {
  showWarningToast,
  showSuccessToast,
  showErrorToast,
} from "../../utils/toast";

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", icon: "wb-sunny" },
  { key: "lunch", label: "Lunch", icon: "wb-cloudy" },
  { key: "dinner", label: "Dinner", icon: "brightness-3" },
  { key: "snack", label: "Snack", icon: "local-cafe" },
];

// Original Sample food database
const QUICK_FOODS: MealItem[] = [
  {
    id: "quick_1",
    name: "Banana (medium)",
    portion: "1 piece",
    nutrients: {
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0,
      fiber: 3,
      sodium: 1,
      potassium: 422,
      calcium: 6,
      iron: 0,
    },
  },
  {
    id: "quick_2",
    name: "Apple (medium)",
    portion: "1 piece",
    nutrients: {
      calories: 95,
      protein: 0,
      carbs: 25,
      fat: 0,
      fiber: 4,
      sodium: 2,
      potassium: 195,
      calcium: 11,
      iron: 0,
    },
  },
  {
    id: "quick_3",
    name: "Greek Yogurt",
    portion: "1 cup",
    nutrients: {
      calories: 130,
      protein: 20,
      carbs: 9,
      fat: 0,
      fiber: 0,
      sodium: 65,
      potassium: 240,
      calcium: 200,
      iron: 0,
    },
  },
  {
    id: "quick_4",
    name: "Whole Wheat Bread",
    portion: "1 slice",
    nutrients: {
      calories: 80,
      protein: 4,
      carbs: 14,
      fat: 1,
      fiber: 2,
      sodium: 170,
      potassium: 69,
      calcium: 30,
      iron: 1,
    },
  },
  {
    id: "quick_5",
    name: "Chicken Breast",
    portion: "3 oz cooked",
    nutrients: {
      calories: 140,
      protein: 26,
      carbs: 0,
      fat: 3,
      fiber: 0,
      sodium: 60,
      potassium: 220,
      calcium: 15,
      iron: 1,
    },
  },
];

export default function MealLogScreen() {
  const { mealLogs, addMealLog, userProfile, favoriteMeals } = useHealth();
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MealItem[]>([]);
  const [adherenceRating, setAdherenceRating] = useState(8);
  const [notes, setNotes] = useState("");

  // --- NEW state for dropdown visibility (now inside modal) ---
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];
  const todayLogs = mealLogs.filter((log) => log.date === todayDate);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // --- Helper for recent meals (unchanged) ---
  const recentMeals = useMemo(() => {
    const uniqueMeals = new Map<string, MealItem>();
    const sortedLogs = [...mealLogs].sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );

    for (const log of sortedLogs) {
      for (const item of log.items) {
        if (!uniqueMeals.has(item.id) && uniqueMeals.size < 5) {
          uniqueMeals.set(item.id, item);
        }
        if (uniqueMeals.size >= 5) break;
      }
      if (uniqueMeals.size >= 5) break;
    }
    return Array.from(uniqueMeals.values());
  }, [mealLogs]);

  // --- Data for SectionList dropdown (unchanged) ---
  const quickAddData = [
    { title: "Favorites", data: favoriteMeals },
    { title: "Recent", data: recentMeals },
  ];

  // --- Original function for the modal "Save" button (unchanged) ---
  const handleAddMeal = async () => {
    if (selectedItems.length === 0) {
      showWarningToast("Please add at least one food item to log your meal.");
      return;
    }

    const newLog: MealLog = {
      id: `log_${Date.now()}`,
      date: todayDate,
      mealType: selectedMealType,
      items: selectedItems,
      adherenceRating,
      notes: notes.trim() || undefined,
      loggedAt: new Date(),
    };

    try {
      await addMealLog(newLog);
      setShowAddModal(false);
      setSelectedItems([]);
      setNotes("");
      setAdherenceRating(8);
      setShowQuickAdd(false); // --- Reset dropdown state on close
      showSuccessToast("Meal logged successfully!");
    } catch (error) {
      showErrorToast("Failed to log meal. Please try again.");
    }
  };

  // --- This function now works for BOTH lists ---
  const toggleFoodItem = (food: MealItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.id === food.id);
      if (exists) {
        return prev.filter((item) => item.id !== food.id);
      } else {
        return [...prev, food];
      }
    });
  };

  const getTotalCalories = (items: MealItem[]) => {
    return items.reduce(
      (sum, item) => sum + Math.round(item.nutrients.calories),
      0
    );
  };

  // --- UPDATED: Render item function for 2-Column Grid ---
  const renderModalQuickAddItem = ({ item }: { item: MealItem }) => {
    const isSelected = selectedItems.find(
      (selected) => selected.id === item.id
    );
    return (
      <TouchableOpacity
        style={[
          styles.quickAddItemGrid,
          isSelected && styles.quickAddItemGridActive,
        ]}
        onPress={() => toggleFoodItem(item)} // Calls toggleFoodItem
      >
        <View style={styles.quickAddItemGridInfo}>
          <Text style={styles.quickAddItemGridName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.quickAddItemGridPortion}>{item.portion}</Text>
          <Text style={styles.quickAddItemGridCalories}>
            {Math.round(item.nutrients.calories)} cal
          </Text>
        </View>
        {isSelected ? (
          <MaterialIcons
            name="check-circle"
            size={24}
            color="#0066CC"
            style={styles.quickAddGridIcon}
          />
        ) : (
          <MaterialIcons
            name="add-circle-outline"
            size={24}
            color="#B0B0B0"
            style={styles.quickAddGridIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["#0066CC", "#0052A3"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Log Your Meals 📝</Text>
            <Text style={styles.subtitle}>
              Track your daily nutrition intake
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addHeaderButton}
            onPress={() => setShowAddModal(true)}
          >
            <MaterialIcons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ORIGINAL "Log New Meal" Button */}
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4CAF50", "#45A049"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButton}
              >
                <MaterialIcons name="add-circle" size={28} color="white" />
                <Text style={styles.addButtonText}>Log New Meal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Today's Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>

            <LinearGradient
              colors={["#FFFFFF", "#F8F9FA"]}
              style={styles.summaryCard}
            >
              <View style={styles.summaryStats}>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconContainer}>
                    <MaterialIcons
                      name="restaurant"
                      size={24}
                      color="#0066CC"
                    />
                  </View>
                  <Text style={styles.summaryValue}>{todayLogs.length}</Text>
                  <Text style={styles.summaryLabel}>Meals Logged</Text>
                </View>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconContainer}>
                    <MaterialIcons
                      name="local-fire-department"
                      size={24}
                      color="#FF6B6B"
                    />
                  </View>
                  <Text style={styles.summaryValue}>
                    {Math.round(
                      todayLogs.reduce(
                        (sum, log) => sum + getTotalCalories(log.items),
                        0
                      )
                    )}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Calories</Text>
                </View>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconContainer}>
                    <MaterialIcons name="star" size={24} color="#FFD700" />
                  </View>
                  <Text style={styles.summaryValue}>
                    {todayLogs.length > 0
                      ? Math.round(
                          todayLogs.reduce(
                            (sum, log) => sum + log.adherenceRating,
                            0
                          ) / todayLogs.length
                        )
                      : 0}
                  </Text>
                  <Text style={styles.summaryLabel}>Avg. Adherence</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Recent Meals (Today's Logged Meals) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Logged Meals</Text>

            {todayLogs.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="restaurant" size={64} color="#CCC" />
                <Text style={styles.emptyText}>No meals logged today</Text>
                <Text style={styles.emptySubtext}>
                  Start tracking your nutrition by logging your first meal
                </Text>
              </View>
            ) : (
              todayLogs.map((log) => {
                const mealType = MEAL_TYPES.find(
                  (type) => type.key === log.mealType
                );
                const mealColors: Record<string, string> = {
                  breakfast: "#FF9800",
                  lunch: "#4CAF50",
                  dinner: "#9C27B0",
                  snack: "#FF5722",
                };
                const mealColor = mealColors[log.mealType] || "#0066CC";

                return (
                  <LinearGradient
                    key={log.id}
                    colors={["#FFFFFF", "#F8F9FA"]}
                    style={styles.mealLogCard}
                  >
                    <View style={styles.mealLogHeader}>
                      <View style={styles.mealTypeContainer}>
                        <View
                          style={[
                            styles.mealTypeIcon,
                            { backgroundColor: `${mealColor}15` },
                          ]}
                        >
                          <MaterialIcons
                            name={(mealType?.icon as any) || "restaurant"}
                            size={24}
                            color={mealColor}
                          />
                        </View>
                        <View>
                          <Text style={styles.mealTypeName}>
                            {mealType?.label}
                          </Text>
                          <Text style={styles.mealTime}>
                            {new Date(log.loggedAt).toLocaleTimeString(
                              "en-US",
                              { hour: "numeric", minute: "2-digit" }
                            )}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.mealLogStats}>
                        <View style={styles.caloriesBadge}>
                          <Text style={styles.caloriesText}>
                            {getTotalCalories(log.items)}
                          </Text>
                          <Text style={styles.caloriesLabel}>cal</Text>
                        </View>
                        <View style={styles.adherenceBadge}>
                          <MaterialIcons
                            name="star"
                            size={14}
                            color="#FFD700"
                          />
                          <Text style={styles.adherenceText}>
                            {log.adherenceRating}/10
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.mealItems}>
                      {log.items.map((item, index) => (
                        <View key={index} style={styles.mealItemRow}>
                          <MaterialIcons
                            name="circle"
                            size={6}
                            color="#0066CC"
                          />
                          <Text style={styles.mealItemText}>
                            {item.name} ({item.portion})
                          </Text>
                        </View>
                      ))}
                    </View>

                    {log.notes && (
                      <View style={styles.mealNotesContainer}>
                        <MaterialIcons name="note" size={14} color="#666" />
                        <Text style={styles.mealNotes}>{log.notes}</Text>
                      </View>
                    )}
                  </LinearGradient>
                );
              })
            )}
          </View>

          {/* Medical Note */}
          {userProfile && (
            <View style={[styles.section, { marginBottom: 20 }]}>
              <LinearGradient
                colors={["#E6F3FF", "#D1E7FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.medicalNote}
              >
                <MaterialIcons
                  name="medical-services"
                  size={24}
                  color="#0066CC"
                />
                <View style={styles.medicalNoteContent}>
                  <Text style={styles.medicalNoteTitle}>
              Tracking for {userProfile.medicalConditionsDisplay.join(', ')}
            </Text>
                  <Text style={styles.medicalNoteText}>
                    Consistent meal logging helps monitor your nutritional
                    adherence and supports better health management.
                  </Text>
                </View>
              </LinearGradient>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* ORIGINAL Add Meal Modal (Now with Quick Add Dropdown) */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer} edges={["top"]}>
          <LinearGradient
            colors={["#0066CC", "#0052A3"]}
            style={styles.modalHeaderGradient}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Log Meal</Text>
              <TouchableOpacity
                onPress={handleAddMeal}
                style={styles.modalSaveButton}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Meal Type Selector (Original) */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Meal Type</Text>
              <View style={styles.mealTypeSelector}>
                {MEAL_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.mealTypeButton,
                      selectedMealType === type.key &&
                        styles.mealTypeButtonSelected,
                    ]}
                    onPress={() => setSelectedMealType(type.key as any)}
                  >
                    <MaterialIcons
                      name={type.icon as any}
                      size={22}
                      color={selectedMealType === type.key ? "#FFFFFF" : "#666"}
                    />
                    <Text
                      style={[
                        styles.mealTypeText,
                        selectedMealType === type.key &&
                          styles.mealTypeTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* --- NEW QUICK ADD DROPDOWN (Inside Modal) --- */}
            <View style={styles.modalSection}>
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => setShowQuickAdd(!showQuickAdd)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickAddButtonText}>
                  ⚡ Quick Add (Favorites & Recent)
                </Text>
                <Ionicons
                  name={showQuickAdd ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#0052A3"
                />
              </TouchableOpacity>

              {showQuickAdd && (
                <View style={styles.quickAddDropdown}>
                  <SectionList
                    sections={quickAddData}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={renderModalQuickAddItem} // <-- Use new render function

                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={styles.quickAddHeader}>{title}</Text>
                    )}
                    ListEmptyComponent={
                      <Text style={styles.quickAddEmpty}>
                        No items to show.
                      </Text>
                    }
                    renderSectionFooter={({ section }) => {
                      if (section.data.length === 0) {
                        return (
                          <Text style={styles.quickAddEmpty}>
                            No {section.title.toLowerCase()} items found.
                          </Text>
                        );
                      }
                      return null;
                    }}
                  />
                </View>
              )}
            </View>
            {/* --- END NEW QUICK ADD DROPDOWN --- */}

            {/* Food Selection (Original Way with QUICK_FOODS) */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                Select Foods (Common)
              </Text>
              {QUICK_FOODS.map((food) => (
                <TouchableOpacity
                  key={food.id}
                  style={[
                    styles.foodItem,
                    selectedItems.find((item) => item.id === food.id) &&
                      styles.foodItemSelected,
                  ]}
                  onPress={() => toggleFoodItem(food)}
                >
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodPortion}>{food.portion}</Text>
                  </View>
                  <View style={styles.foodStats}>
                    <Text style={styles.foodCalories}>
                      {food.nutrients.calories} cal
                    </Text>
                    {selectedItems.find((item) => item.id === food.id) ? (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color="#0066CC"
                      />
                    ) : (
                      <MaterialIcons
                        name="add-circle-outline"
                        size={20}
                        color="#B0B0B0"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Adherence Rating (Original) */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                How well did this meal fit your diet plan? (1-10)
              </Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      adherenceRating === rating && styles.ratingButtonSelected,
                    ]}
                    onPress={() => setAdherenceRating(rating)}
                  >
                    <Text
                      style={[
                        styles.ratingText,
                        adherenceRating === rating && styles.ratingTextSelected,
                      ]}
                    >
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes (Original) */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any additional notes about this meal..."
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Selected Items Summary (Original) */}
            {selectedItems.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Selected Items ({selectedItems.length})
                </Text>
                <View style={styles.selectedSummary}>
                  <Text style={styles.selectedCalories}>
                    Total Calories: {getTotalCalories(selectedItems)}
                  </Text>
                  {selectedItems.map((item, index) => (
                    <Text key={index} style={styles.selectedItem}>
                      • {item.name} ({item.portion})
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  addHeaderButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    elevation: 6,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  // --- NEW/MODIFIED QUICK ADD STYLES (for inside modal) ---
  quickAddButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#E6F3FF",
  },
  quickAddButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0052A3",
  },
  quickAddDropdown: {
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingHorizontal: 4, // Padding for the grid items
  },
  quickAddHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 6, // Space for grid
    width: "100%", // Ensure it spans full width
  },
  quickAddEmpty: {
    textAlign: "center",
    paddingVertical: 16,
    color: "#999",
    fontSize: 14,
    width: "100%", // Ensure it spans full width
  },
  quickAddItemGrid: {
    flex: 1, // This makes it 50% width due to numColumns={2}
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    margin: 6, // Spacing between grid items
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 110, // Ensure cards have a uniform height
  },
  quickAddItemGridActive: {
    backgroundColor: "#E6F3FF",
    borderColor: "#0066CC",
  },
  quickAddItemGridInfo: {
    flex: 1, // Allow text to take space
  },
  quickAddItemGridName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    minHeight: 34, // Allocates space for 2 lines of text
  },
  quickAddItemGridPortion: {
    fontSize: 12,
    color: "#666",
  },
  quickAddItemGridCalories: {
    fontSize: 13,
    color: "#0066CC",
    fontWeight: "bold",
    marginTop: 6,
  },
  quickAddGridIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  // --- END NEW QUICK ADD STYLES ---

  summaryCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 102, 204, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066CC",
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  mealLogCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  mealLogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#F0F0F0",
  },
  mealTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  mealTypeName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  mealTime: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  mealLogStats: {
    alignItems: "flex-end",
  },
  caloriesBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#E6F3FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
  },
  caloriesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0066CC",
    marginLeft: 2,
  },
  adherenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adherenceText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "600",
  },
  mealItems: {
    marginBottom: 8,
  },
  mealItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  mealItemText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
  mealNotesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  mealNotes: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginLeft: 6,
    flex: 1,
  },
  medicalNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  medicalNoteContent: {
    flex: 1,
    marginLeft: 14,
  },
  medicalNoteTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 6,
  },
  medicalNoteText: {
    fontSize: 13,
    color: "#0066CC",
    lineHeight: 20,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  modalHeaderGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  saveText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSection: {
    marginTop: 24,
  },
  modalSectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 14,
  },
  mealTypeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  mealTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  mealTypeButtonSelected: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
    elevation: 4,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mealTypeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  mealTypeTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  // --- Original foodItem styles (unchanged) ---
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  foodItemSelected: {
    backgroundColor: "#E6F3FF",
    borderColor: "#0066CC",
    borderWidth: 2,
    elevation: 4,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  foodInfo: {
    flex: 1,
    marginRight: 8, // Added margin
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  foodPortion: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  foodStats: {
    flexDirection: "row", // Added
    alignItems: "center", // Added
    gap: 8, // Added
  },
  foodCalories: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0066CC",
  },
  // --- End original foodItem styles ---
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ratingButton: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  ratingButtonSelected: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
    elevation: 4,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  ratingTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  notesInput: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
    textAlignVertical: "top",
    height: 100,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedSummary: {
    backgroundColor: "#E6F3FF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCalories: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 12,
  },
  selectedItem: {
    fontSize: 14,
    color: "#0066CC",
    marginBottom: 6,
    fontWeight: "500",
  },
});

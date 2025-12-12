import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CourseScreenProps = {
  navigation: any;
  isChef: boolean;
  currentUser: any;
};

//Mock structure for calculator
const mockDishesByCourse = {
  'Hot plates': [
    { price: 34.99 },
    { price: 28.99 },
    { price: 42.99 },
    { price: 24.99 }
  ],
  'Cold plates': [
    { price: 22.99 },
    { price: 26.99 },
    { price: 18.99 },
    { price: 32.99 }
  ],
  'Baked goods': [
    { price: 8.99 },
    { price: 6.99 },
    { price: 7.99 },
    { price: 9.99 }
  ],
  'Beverages': [
    { price: 4.99 },
    { price: 9.99 },
    { price: 12.99 },
    { price: 3.99 }
  ]
};

const CourseScreen: React.FC<CourseScreenProps> = ({ navigation, isChef, currentUser }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [averagePrices, setAveragePrices] = useState<{[key: string]: number}>({});

  // Course categories
  const courses = [
    {
      id: 1,
      name: 'Hot plates',
      image: require('../assets/background.jpg'),
      description: 'Hot portions straight from the fire',
    },
    {
      id: 2,
      name: 'Cold plates',
      image: require('../assets/background.jpg'),
      description: 'Cold cuts with love to warm you',
    },
    {
      id: 3,
      name: 'Baked goods',
      image: require('../assets/background.jpg'),
      description: 'Freshly baked treats and desserts',
    },
    {
      id: 4,
      name: 'Beverages',
      image: require('../assets/background.jpg'),
      description: 'Drinks and refreshments',
    },
  ];

  // Calculates average prices for each course
  useEffect(() => {
    const calculateAverages = () => {
      const averages: {[key: string]: number} = {};
      
      Object.keys(mockDishesByCourse).forEach(courseName => {
        const dishes = mockDishesByCourse[courseName as keyof typeof mockDishesByCourse];
        if (dishes && dishes.length > 0) {
          const total = dishes.reduce((sum, dish) => sum + dish.price, 0);
          averages[courseName] = total / dishes.length;
        }
      });
      
      setAveragePrices(averages);
    };

    calculateAverages();
  }, []);

  // Function to calculate average price for a specific course
  const calculateAveragePrice = (courseName: string): number => {
    const dishes = mockDishesByCourse[courseName as keyof typeof mockDishesByCourse];
    if (!dishes || dishes.length === 0) return 0;
    
    const total = dishes.reduce((sum, dish) => sum + dish.price, 0);
    return total / dishes.length;
  };

  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    } else {
      setIsMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToScreen = (screenName: string) => {
    toggleMenu();
    navigation.navigate(screenName);
  };

  const handleCoursePress = (course: any) => {
    // Navigate to UserMenuScreen with the selected course filter
    navigation.navigate('UserMenu', { 
      filterBy: course.name,
      courseId: course.id 
    });
  };

  const handleAddDishPress = () => {
    if (isChef && currentUser) {
      navigation.navigate('PrivateMenu');
    } else {
      navigation.navigate('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with hamburger menu and profile */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.cartButton} onPress={navigateToProfile}>
          <Image source={require('../assets/profile-icon.jpg')} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal visible={isMenuVisible} transparent animationType="none" onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.menuOverlay} onPress={toggleMenu}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateY: menuTranslateY }] }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('UserMenu')}>
              <Text style={styles.menuItemText}>User Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('Home')}>
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Course Categories Cards */}
      <ScrollView 
        contentContainerStyle={styles.courseGrid}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course) => {
          const avgPrice = averagePrices[course.name] || calculateAveragePrice(course.name);
          
          return (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => handleCoursePress(course)}
            >
              <Image source={course.image} style={styles.courseImage} resizeMode="cover" />
              <View style={styles.courseOverlay}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
                
                {/* Average Price Display with Calculator Icon */}
                <View style={styles.averagePriceContainer}>
                  <Text style={styles.averagePriceLabel}>Average Price:</Text>
                  <View style={styles.priceDisplay}>
                    <Text style={styles.calculatorIcon}>🧮</Text>
                    <Text style={styles.coursePrice}>R{avgPrice.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.priceNote}>
                    Based on {mockDishesByCourse[course.name as keyof typeof mockDishesByCourse]?.length || 0} dishes
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* only Chef can see Add Dish Button */}
      {isChef && (
        <TouchableOpacity 
          style={styles.addDishButton} 
          onPress={handleAddDishPress}
        >
          <Text style={styles.addDishButtonText}>➕ Add New Dish</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  hamburger: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cartButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#1f2937',
    paddingTop: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  courseGrid: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  courseCard: {
    height: 200,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  courseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  courseDescription: {
    fontSize: 16,
    color: '#e5e7eb',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  averagePriceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
    marginTop: 8,
  },
  averagePriceLabel: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 4,
    fontWeight: '600',
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  calculatorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  coursePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ec4899',
    letterSpacing: 0.5,
  },
  priceNote: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  addDishButton: {
    margin: 20,
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addDishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default CourseScreen;
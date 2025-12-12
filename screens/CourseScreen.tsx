import React, { useState } from 'react';
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

const CourseScreen: React.FC<CourseScreenProps> = ({ navigation, isChef, currentUser }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');

  // Course categories with average prices
  const courses = [
    {
      id: 1,
      name: 'Appetizers',
      averagePrice: 12.99,
      image: require('../assets/background.jpg'),
      description: 'Starters and small plates',
    },
    {
      id: 2,
      name: 'Main Courses',
      averagePrice: 24.99,
      image: require('../assets/background.jpg'),
      description: 'Hearty main dishes',
    },
    {
      id: 3,
      name: 'Desserts',
      averagePrice: 9.99,
      image: require('../assets/background.jpg'),
      description: 'Sweet treats and desserts',
    },
    {
      id: 4,
      name: 'Beverages',
      averagePrice: 5.99,
      image: require('../assets/background.jpg'),
      description: 'Drinks and refreshments',
    },
  ];

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
    // Navigate to filtered menu screen with selected course
    navigation.navigate('Menu', { filterBy: course.name });
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
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("Private Menu")}>
              <Text style={styles.menuItemText}>Private Menu</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Course Categories Grid */}
      <ScrollView 
        contentContainerStyle={styles.courseGrid}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => handleCoursePress(course)}
          >
            <Image source={course.image} style={styles.courseImage} resizeMode="cover" />
            <View style={styles.courseOverlay}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.courseDescription}>{course.description}</Text>
              <Text style={styles.coursePrice}>Avg: R{course.averagePrice.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    height: 180,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  courseDescription: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ec4899',
    letterSpacing: 0.5,
  },
});

export default CourseScreen;
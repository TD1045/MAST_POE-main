import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type WelcomeScreenProps = {
  navigation: any;
  route: any;
  isChef: boolean;
  currentUser: any;
  setIsChef: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
};

export default function WelcomeScreen({
  navigation,
  route,
  isChef,
  currentUser,
  setIsChef,
  setCurrentUser,
}: WelcomeScreenProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));

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

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <View style={styles.hamburger}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>Radbull</Text>

          <TouchableOpacity style={styles.cartButton} onPress={navigateToProfile}>
            <Image
              source={require('../assets/profile-icon.jpg')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={isMenuVisible}
          transparent={true}
          animationType="none"
          onRequestClose={toggleMenu}
        >
          <TouchableOpacity style={styles.menuOverlay} onPress={toggleMenu}>
            <Animated.View
              style={[
                styles.menuContainer,
                { transform: [{ translateY: menuTranslateY }] },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen('UserMenu')}
              >
                <Text style={styles.menuItemText}>User Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen('Courses')}
              >
                <Text style={styles.menuItemText}>Courses</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Radbull</Text>
          <Text style={styles.welcomeSubtitle}>
            Discover our amazing culinary experiences
          </Text>

          <TouchableOpacity
            style={styles.mainCourseLink}
            onPress={() => navigation.navigate('Courses')}
          >
            <Image
              source={require('../assets/courses-hero.jpg')}
              style={styles.courseHeroImage}
              resizeMode="cover"
            />
            <View style={styles.courseOverlay}>
              <Text style={styles.courseLinkTitle}>See Courses ↓</Text>
              <Text style={styles.courseLinkSubtitle}>
                Browse through our curated course offerings
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userMenuLink}
            onPress={() => navigation.navigate('UserMenu')}
          >
            <View style={styles.userMenuContent}>
              <Image
                source={require('../assets/user-menu-icon.jpg')}
                style={styles.userMenuIcon}
              />
              <View style={styles.userMenuText}>
                <Text style={styles.userMenuTitle}>User Menu</Text>
                <Text style={styles.userMenuDescription}>
                  browse over the full menu
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PrivateMenu')}
            >
              <Text style={styles.quickActionText}>Private Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  hamburger: {
    width: 22,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cartButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileIcon: { width: 24, height: 24, tintColor: '#fff' },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
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
  welcomeContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
    welcomeTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mainCourseLink: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  courseHeroImage: { width: '100%', height: '100%' },
  courseOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: 20,
  },
  courseLinkTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  courseLinkSubtitle: {
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '500',
  },
  userMenuLink: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userMenuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMenuIcon: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  userMenuText: { flex: 1 },
  userMenuTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userMenuDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

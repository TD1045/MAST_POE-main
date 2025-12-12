import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated, Alert, StatusBar, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type UserMenuScreenProps = {
  navigation: any;
  route: any;
  isChef: boolean;
  currentUser: any;
};

const UserMenuScreen: React.FC<UserMenuScreenProps> = ({ navigation, route, isChef, currentUser }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const courses = [
    {
      id: 1,
      title: 'Italian Cuisine',
      dishes: [
        {
          id: 1,
          title: 'Spaghetti Carbonara',
          image: require('../assets/carbonara.jpg'),
          description: 'Classic Roman pasta dish with eggs, cheese, pancetta, and black pepper',
          price: 18.99,
          preparationTime: '25 mins',
          ingredients: [
            'Spaghetti',
            'Eggs',
            'Pecorino Romano cheese',
            'Pancetta',
            'Black pepper',
            'Salt'
          ],
          calories: 650,
          difficulty: 'Medium',
          chefTips: 'Use fresh eggs and grate the cheese finely for best results'
        },
        {
          id: 2,
          title: 'Margherita Pizza',
          image: require('../assets/pizza.jpg'),
          description: 'Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil, and olive oil',
          price: 16.99,
          preparationTime: '15 mins',
          ingredients: [
            'Pizza dough',
            'San Marzano tomatoes',
            'Fresh mozzarella',
            'Fresh basil',
            'Extra virgin olive oil',
            'Salt'
          ],
          calories: 850,
          difficulty: 'Easy',
          chefTips: 'Cook in a very hot oven for authentic Neapolitan crust'
        },
        {
          id: 3,
          title: 'Tiramisu',
          image: require('../assets/tiramisu.jpg'),
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
          price: 8.99,
          preparationTime: '30 mins + chilling',
          ingredients: [
            'Ladyfingers',
            'Espresso coffee',
            'Mascarpone cheese',
            'Eggs',
            'Sugar',
            'Cocoa powder'
          ],
          calories: 420,
          difficulty: 'Medium',
          chefTips: 'Chill for at least 4 hours for best flavor development'
        }
      ]
    },
    {
      id: 2,
      title: 'Japanese Cuisine',
      dishes: [
        {
          id: 4,
          title: 'Salmon Sashimi',
          image: require('../assets/sashimi.jpg'),
          description: 'Fresh Atlantic salmon sliced thin and served with soy sauce and wasabi',
          price: 22.99,
          preparationTime: '10 mins',
          ingredients: [
            'Fresh salmon fillet',
            'Soy sauce',
            'Wasabi',
            'Pickled ginger',
            'Shiso leaves'
          ],
          calories: 280,
          difficulty: 'Expert',
          chefTips: 'Use the sharpest knife possible for clean cuts'
        },
        {
          id: 5,
          title: 'Chicken Teriyaki',
          image: require('../assets/teriyaki.jpg'),
          description: 'Grilled chicken glazed with sweet teriyaki sauce, served with steamed rice',
          price: 19.99,
          preparationTime: '20 mins',
          ingredients: [
            'Chicken thighs',
            'Soy sauce',
            'Mirin',
            'Sake',
            'Sugar',
            'Ginger',
            'Garlic'
          ],
          calories: 520,
          difficulty: 'Easy',
          chefTips: 'Marinate the chicken for at least 30 minutes for deeper flavor'
        }
      ]
    }
  ];

  const allDishes = courses.flatMap(course => course.dishes);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
    }
    setCurrentIndex(index);
  };

  const showScrollAlert = () => {
    Alert.alert(
      'Navigation Tip',
      'Swipe left or right to browse through all dishes. Scroll down for more details about each dish.',
      [
        { 
          text: 'Got it!', 
          style: 'default',
        }
      ]
    );
  };

  // Show alert on first render
  React.useEffect(() => {
    showScrollAlert();
  }, []);

  const renderDishItem = ({ item, index }: { item: any; index: number }) => (
    <ScrollView 
      style={styles.dishContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.dishContent}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.dishImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <Text style={styles.dishTitle}>{item.title}</Text>
        <View style={styles.dishBadge}>
          <Text style={styles.dishBadgeText}>R{item.price}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>

        <View style={styles.basicInfo}>
          <Text style={styles.dishDescription}>{item.description}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Prep Time</Text>
              <Text style={styles.statValue}>{item.preparationTime}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{item.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>{item.calories}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {item.ingredients.map((ingredient: string, idx: number) => (
              <View key={idx} style={styles.ingredientItem}>
                <Text style={styles.ingredientDot}>•</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chef's Tips</Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsText}>{item.chefTips}</Text>
          </View>
        </View>

        <View style={styles.navigationHelp}>
          <Text style={styles.navigationText}>
            Swipe to explore more dishes
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {allDishes.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive
              ]}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>
        <Text style={styles.paginationText}>
          {currentIndex + 1} / {allDishes.length}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
     
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dishes</Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={showScrollAlert}
        >
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.courseTitleContainer}>
        <Text style={styles.courseTitle}>
          {courses.find(course => 
            course.dishes.some((dish: any) => dish.id === allDishes[currentIndex]?.id)
          )?.title || 'All Dishes'}
        </Text>
        <Text style={styles.courseSubtitle}>
          Swipe to explore all dishes
        </Text>
      </View>

      <View style={styles.carouselContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {allDishes.map((dish, index) => (
            <View key={dish.id} style={styles.carouselItem}>
              {renderDishItem({ item: dish, index })}
            </View>
          ))}
        </Animated.ScrollView>
      </View>

      {renderPagination()}

      <View style={styles.navigationArrows}>
        <TouchableOpacity 
          style={[styles.arrowButton, currentIndex === 0 && styles.arrowButtonDisabled]}
          onPress={() => scrollToIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.arrowButton, currentIndex === allDishes.length - 1 && styles.arrowButtonDisabled]}
          onPress={() => scrollToIndex(Math.min(allDishes.length - 1, currentIndex + 1))}
          disabled={currentIndex === allDishes.length - 1}
        >
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  backButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  helpButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  helpButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  courseTitleContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
    fontWeight: '500',
  },
  carouselContainer: {
    flex: 1,
  },
  carousel: {
    flex: 1,
  },
  carouselItem: {
    width: screenWidth,
  },
  dishContainer: {
    flex: 1,
  },
  dishContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: screenHeight * 0.4,
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dishTitle: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  dishBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dishBadgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  basicInfo: {
    marginBottom: 30,
  },
  dishDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  ingredientsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientDot: {
    color: 'rgba(236, 72, 153, 0.9)',
    fontSize: 16,
    marginRight: 12,
    fontWeight: 'bold',
  },
  ingredientText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(236, 72, 153, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  tipsText: {
    fontSize: 15,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '500',
  },
  navigationHelp: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(236, 72, 153, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  navigationText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  paginationDots: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    width: 20,
  },
  paginationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  navigationArrows: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  arrowButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 24,
    color: '#1f2937',
    fontWeight: 'bold',
  },
});

export default UserMenuScreen;
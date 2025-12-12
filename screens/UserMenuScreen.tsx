import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Image, Dimensions, Animated, Alert, StatusBar, Modal,
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type UserMenuScreenProps = {
  navigation: any;
  route: any;
  isChef: boolean;
  currentUser: any;
};

// Cart Item Type
type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: any;
  category: string;
};

const UserMenuScreen: React.FC<UserMenuScreenProps> = ({ 
  navigation, route, isChef, currentUser 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const filterBy = route.params?.filterBy || 'All';
  const courseId = route.params?.courseId;

  // Updated dishes matching your new categories (4 dishes per category)
  const courses = [
    {
      id: 1,
      title: 'Hot Plates',
      dishes: [
        {
          id: 1,
          title: 'Braised Lamb Shank',
          image: require('../assets/background.jpg'),
          description: 'Tender lamb slow-cooked in red wine and herbs',
          price: 34.99,
          preparationTime: '3 hours',
          ingredients: [
            'Lamb shank',
            'Red wine',
            'Fresh rosemary',
            'Garlic',
            'Carrots',
            'Potatoes'
          ],
          calories: 780,
          difficulty: 'Expert',
          chefTips: 'Braise at low temperature for maximum tenderness',
          category: 'Hot plates'
        },
         },
         {
          id: 2,
          title: 'Seared Salmon Steak',
          image: require('../assets/salmon-steak.jpg'),
          description: 'Atlantic salmon with crispy skin and lemon butter sauce',
          price: 28.99,
          preparationTime: '20 mins',
          ingredients: [
            'Salmon fillet',
            'Lemon',
            'Butter',
            'Fresh dill',
            'Asparagus',
            'Baby potatoes'
          ],
          calories: 520,
          difficulty: 'Medium',
          chefTips: 'Start skin-side down for perfect crispiness',
          category: 'Hot plates'
        },
        {
          id: 3,
          title: 'Beef Wellington',
          image: require('../assets/beef-wellington.jpg'),
          description: 'Filet mignon wrapped in puff pastry with mushroom duxelles',
          price: 42.99,
          preparationTime: '2.5 hours',
          ingredients: [
            'Beef tenderloin',
            'Puff pastry',
            'Mushrooms',
            'Prosciutto',
            'Dijon mustard',
            'Egg wash'
          ],
          calories: 920,
          difficulty: 'Expert',
          chefTips: 'Chill thoroughly before baking to prevent leakage',
          category: 'Hot plates'
        },
        {
          id: 4,
          title: 'Chicken Supreme',
          image: require('../assets/chicken-supreme.jpg'),
          description: 'Pan-seared chicken breast with creamy wild mushroom sauce',
          price: 24.99,
          preparationTime: '35 mins',
          ingredients: [
            'Chicken breast',
            'Wild mushrooms',
            'Cream',
            'White wine',
            'Shallots',
            'Thyme'
          ],
          calories: 480,
          difficulty: 'Medium',
          chefTips: 'Rest chicken before slicing to retain juices',
          category: 'Hot plates'
        }
      ]
    },
    {
      id: 2,
      title: 'Cold Plates',
      dishes: [
        {
          id: 5,
          title: 'Smoked Salmon Platter',
          image: require('../assets/smoked-salmon.jpg'),
          description: 'House-smoked salmon with capers, red onion and crème fraîche',
          price: 22.99,
          preparationTime: '15 mins',
          ingredients: [
            'Smoked salmon',
            'Capers',
            'Red onion',
            'Crème fraîche',
            'Lemon',
            'Dill',
            'Rye bread'
          ],
          calories: 320,
          difficulty: 'Easy',
          chefTips: 'Slice salmon against the grain for perfect texture',
          category: 'Cold plates'
        },
        {
          id: 6,
          title: 'Beef Carpaccio',
          image: require('../assets/carpaccio.jpg'),
          description: 'Paper-thin sliced beef with truffle oil and Parmesan',
          price: 26.99,
          preparationTime: '20 mins',
          ingredients: [
            'Beef tenderloin',
            'Truffle oil',
            'Parmesan cheese',
            'Arugula',
            'Lemon juice',
            'Black pepper'
          ],
          calories: 280,
          difficulty: 'Expert',
          chefTips: 'Freeze beef slightly for easier slicing',
          category: 'Cold plates'
        },
        {
          id: 7,
          title: 'Summer Salad Bowl',
          image: require('../assets/summer-salad.jpg'),
          description: 'Fresh seasonal vegetables with goat cheese and balsamic glaze',
          price: 18.99,
          preparationTime: '15 mins',
          ingredients: [
            'Mixed greens',
            'Cherry tomatoes',
            'Cucumber',
            'Goat cheese',
            'Avocado',
            'Balsamic reduction'
          ],
          calories: 240,
          difficulty: 'Easy',
          chefTips: 'Toss salad just before serving to maintain crispness',
          category: 'Cold plates'
        },
        {
          id: 8,
          title: 'Charcuterie Board',
          image: require('../assets/charcuterie.jpg'),
          description: 'Artisanal cured meats, cheeses and accompaniments',
          price: 32.99,
          preparationTime: '25 mins',
          ingredients: [
            'Prosciutto',
            'Salami',
            'Brie cheese',
            'Blue cheese',
            'Grapes',
            'Fig jam',
            'Crackers'
          ],
          calories: 450,
          difficulty: 'Easy',
          chefTips: 'Arrange from mild to strong flavors clockwise',
          category: 'Cold plates'
        }
      ]
    },
    {
      id: 3,
      title: 'Baked Goods',
      dishes: [
        {
          id: 9,
          title: 'Sourdough Bread',
          image: require('../assets/sourdough.jpg'),
          description: 'Artisanal sourdough with crispy crust and airy crumb',
          price: 8.99,
          preparationTime: '24 hours + baking',
          ingredients: [
            'Sourdough starter',
            'Bread flour',
            'Water',
            'Salt'
          ],
          calories: 220,
          difficulty: 'Expert',
          chefTips: 'Maintain consistent temperature for proper fermentation',
          category: 'Baked goods'
        },
        {
          id: 10,
          title: 'Croissants',
          image: require('../assets/croissants.jpg'),
          description: 'Buttery, flaky French croissants',
          price: 6.99,
          preparationTime: '12 hours + baking',
          ingredients: [
            'Butter',
            'Bread flour',
            'Milk',
            'Sugar',
            'Yeast'
          ],
          calories: 280,
          difficulty: 'Expert',
          chefTips: 'Keep butter cold and work quickly during lamination',
          category: 'Baked goods'
        },
        {
          id: 11,
          title: 'Chocolate Éclairs',
          image: require('../assets/eclairs.jpg'),
          description: 'Choux pastry filled with vanilla cream and chocolate glaze',
          price: 7.99,
          preparationTime: '2 hours',
          ingredients: [
            'Choux pastry',
            'Vanilla pastry cream',
            'Dark chocolate',
            'Cream',
            'Powdered sugar'
          ],
          calories: 320,
          difficulty: 'Medium',
          chefTips: 'Poke holes in baked shells to release steam',
          category: 'Baked goods'
        },
        {
          id: 12,
          title: 'Apple Tart',
          image: require('../assets/apple-tart.jpg'),
          description: 'Classic French apple tart with caramelized edges',
          price: 9.99,
          preparationTime: '1.5 hours',
          ingredients: [
            'Puff pastry',
            'Apples',
            'Butter',
            'Sugar',
            'Cinnamon',
            'Apricot jam'
          ],
          calories: 380,
          difficulty: 'Medium',
          chefTips: 'Overlap apple slices tightly for beautiful presentation',
          category: 'Baked goods'
        }
      ]
    },
    {
      id: 4,
      title: 'Beverages',
      dishes: [
        {
          id: 13,
          title: 'Craft IPA',
          image: require('../assets/ipa.jpg'),
          description: 'Locally brewed India Pale Ale with citrus notes',
          price: 7.99,
          preparationTime: 'Served cold',
          ingredients: [
            'Hops',
            'Malted barley',
            'Yeast',
            'Water',
            'Citrus peel'
          ],
          calories: 180,
          difficulty: 'Easy',
          chefTips: 'Serve at 8°C for optimal flavor',
          category: 'Beverages'
        },
        {
          id: 14,
          title: 'Barista Coffee',
          image: require('../assets/barista-coffee.jpg'),
          description: 'Single-origin espresso with latte art',
          price: 4.99,
          preparationTime: '5 mins',
          ingredients: [
            'Arabica beans',
            'Fresh milk',
            'Filtered water'
          ],
          calories: 120,
          difficulty: 'Expert',
          chefTips: 'Use freshly ground beans for best aroma',
          category: 'Beverages'
        },
        {
          id: 15,
          title: 'House Sangria',
          image: require('../assets/sangria.jpg'),
          description: 'Red wine sangria with fresh fruits and brandy',
          price: 9.99,
          preparationTime: '2 hours + chilling',
          ingredients: [
            'Red wine',
            'Brandy',
            'Orange juice',
            'Mixed fruits',
            'Soda water'
          ],
          calories: 210,
          difficulty: 'Easy',
          chefTips: 'Let sangria sit overnight for deeper flavor',
          category: 'Beverages'
        },
        {
          id: 16,
          title: 'Craft Cocktail',
          image: require('../assets/craft-cocktail.jpg'),
          description: 'Signature gin cocktail with botanical infusion',
          price: 12.99,
          preparationTime: '8 mins',
          ingredients: [
            'Premium gin',
            'Fresh lime',
            'Simple syrup',
            'Cucumber',
            'Mint',
            'Soda water'
          ],
          calories: 160,
          difficulty: 'Medium',
          chefTips: 'Use large ice cubes to minimize dilution',
          category: 'Beverages'
        }
      ]
    },
  ];

  // Filter dishes based on route param
  const filteredCourses = filterBy === 'All' 
    ? courses 
    : courses.filter(course => course.title === filterBy);
  
  const allDishes = filteredCourses.flatMap(course => course.dishes);
  const filteredDishes = courseId 
    ? courses.find(c => c.id === courseId)?.dishes || allDishes
    : allDishes;

  // Dropdown Menu Functions
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

  const navigateToScreen = (screenName: string) => {
    toggleMenu();
    navigation.navigate(screenName);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  // Cart Functions
  const addToCart = (dish: any) => {
    if (!currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add items to your cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign In', 
            onPress: () => navigation.navigate('Profile') 
          }
        ]
      );
      return;
    }

    const existingItem = cartItems.find(item => item.id === dish.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { 
        ...dish, 
        quantity: 1,
        category: dish.category
      }]);
    }
    
    Alert.alert(
      'Added to Cart',
      `${dish.title} has been added to your cart.`,
      [{ text: 'OK' }]
    );
  };

  const removeFromCart = (dishId: number) => {
    setCartItems(cartItems.filter(item => item.id !== dishId));
  };

  const updateQuantity = (dishId: number, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === dishId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => setCartItems([]) 
        }
      ]
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Carousel Functions
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
  useEffect(() => {
    showScrollAlert();
  }, []);

  const renderDishItem = ({ item, index }: { item: any; index: number }) => {
    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    const quantity = cartItem?.quantity || 0;

    return (
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
          
          {/* Only Chef Can See Add Dish Button */}
          {isChef && (
            <TouchableOpacity 
              style={styles.chefAddButton}
              onPress={() => navigation.navigate('PrivateMenu', { dishToEdit: item })}
            >
              <Text style={styles.chefAddButtonText}>Edit Dish</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.basicInfo}>
            <Text style={styles.dishDescription}>{item.description}</Text>
            
            {/* Cart Controls */}
            <View style={styles.cartControls}>
              <TouchableOpacity 
                style={[styles.cartButton, styles.addToCartButton]}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
              
              {quantity > 0 && (
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{quantity} in cart</Text>
                  
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

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
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {filteredDishes.map((_, index) => (
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
          {currentIndex + 1} / {filteredDishes.length}
        </Text>
      </View>
    );
  };

  const renderCartModal = () => (
    <Modal
      visible={isCartVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsCartVisible(false)}
    >
      <View style={styles.cartModalContainer}>
        <View style={styles.cartModalContent}>
          <View style={styles.cartModalHeader}>
            <Text style={styles.cartModalTitle}>Your Cart</Text>
            <TouchableOpacity onPress={() => setIsCartVisible(false)}>
              <Text style={styles.cartCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
              <Text style={styles.emptyCartSubtext}>
                Browse dishes and add items to get started
              </Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.cartItemsList}>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItemRow}>
                    <Image source={item.image} style={styles.cartItemImage} />
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemName}>{item.title}</Text>
                      <Text style={styles.cartItemCategory}>{item.category}</Text>
                      <Text style={styles.cartItemPrice}>R{item.price} each</Text>
                    </View>
                    <View style={styles.cartItemControls}>
                      <View style={styles.cartQuantityControls}>
                        <TouchableOpacity 
                          style={styles.cartQuantityButton}
                          onPress={() => updateQuantity(item.id, -1)}
                        >
                          <Text style={styles.cartQuantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.cartQuantityText}>{item.quantity}</Text>
                        <TouchableOpacity 
                          style={styles.cartQuantityButton}
                          onPress={() => updateQuantity(item.id, 1)}
                        >
                          <Text style={styles.cartQuantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.cartItemTotal}>
                        R{(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <TouchableOpacity 
                        style={styles.removeItemButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Text style={styles.removeItemButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.cartTotalContainer}>
                <View style={styles.cartTotalRow}>
                  <Text style={styles.cartTotalLabel}>Subtotal:</Text>
                  <Text style={styles.cartTotalValue}>R{getTotalPrice()}</Text>
                </View>
                <View style={styles.cartTotalRow}>
                  <Text style={styles.cartTotalLabel}>Items:</Text>
                  <Text style={styles.cartTotalValue}>{getItemCount()}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.checkoutButton}
                  onPress={() => {
                    Alert.alert(
                      'Checkout',
                      `Total: R${getTotalPrice()}\n\nThank you for your order!`,
                      [{ text: 'OK', onPress: () => setCartItems([]) }]
                    );
                  }}
                >
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.clearCartButton}
                  onPress={clearCart}
                >
                  <Text style={styles.clearCartButtonText}>Clear Cart</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
     
      <View style={styles.header}>
        {/* Hamburger Menu Button (replaces back button) */}
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {filterBy === 'All' ? 'All Dishes' : filterBy}
          </Text>
          {courseId && (
            <Text style={styles.headerSubtitle}>
              {courses.find(c => c.id === courseId)?.title}
            </Text>
          )}
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={showScrollAlert}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cartIconButton}
            onPress={() => setIsCartVisible(true)}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal visible={isMenuVisible} transparent animationType="none" onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.menuOverlay} onPress={toggleMenu}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateY: menuTranslateY }] }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('UserMenu')}>
              <Text style={styles.menuItemText}>User Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('Courses')}>
              <Text style={styles.menuItemText}>Course Menu</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.courseTitleContainer}>
        <Text style={styles.courseTitle}>
          {filteredCourses.find(course => 
            course.dishes.some((dish: any) => dish.id === filteredDishes[currentIndex]?.id)
          )?.title || 'Menu'}
        </Text>
        <Text style={styles.courseSubtitle}>
          Swipe to explore all dishes • Tap items to add to cart
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
          {filteredDishes.map((dish, index) => (
            <View key={dish.id} style={styles.carouselItem}>
              {renderDishItem({ item: dish, index })}
            </View>
          ))}
        </Animated.ScrollView>
      </View>

      {renderPagination()}
      {renderCartModal()}

      <View style={styles.navigationArrows}>
        <TouchableOpacity 
          style={[styles.arrowButton, currentIndex === 0 && styles.arrowButtonDisabled]}
          onPress={() => scrollToIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.arrowButton, currentIndex === filteredDishes.length - 1 && styles.arrowButtonDisabled]}
          onPress={() => scrollToIndex(Math.min(filteredDishes.length - 1, currentIndex + 1))}
          disabled={currentIndex === filteredDishes.length - 1}
        >
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Only Chef Can See Add Dish Button */}
      {isChef && (
        <TouchableOpacity 
          style={styles.floatingAddButton}
          onPress={() => navigation.navigate('PrivateMenu')}
        >
          <Text style={styles.floatingAddButtonText}>+ Add New Dish</Text>
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e5e7eb',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  helpButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cartIconButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  // Rest of the styles remain the same...
  courseTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
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
    paddingBottom: 100,
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
  },
  dishBadgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  chefAddButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefAddButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
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
  cartControls: {
    marginBottom: 20,
  },
  cartButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
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
  },
  tipsText: {
    fontSize: 15,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  navigationHelp: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(236, 72, 153, 0.9)',
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
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 24,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingAddButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  // Cart Modal Styles
  cartModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  cartModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: screenHeight * 0.8,
  },
  cartModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cartModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  cartCloseButton: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  cartItemsList: {
    maxHeight: screenHeight * 0.5,
    paddingHorizontal: 16,
  },
  cartItemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  cartItemCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  cartItemControls: {
    alignItems: 'flex-end',
  },
  cartQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cartQuantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartQuantityButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  cartQuantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 12,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  removeItemButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeItemButtonText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  cartTotalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartTotalLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  cartTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  checkoutButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  clearCartButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  clearCartButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserMenuScreen;

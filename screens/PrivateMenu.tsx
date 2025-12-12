import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Image, Modal, Alert, FlatList, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PrivateMenuScreenProps = {
  navigation: any;
  isChef: boolean;
  currentUser: any;
};

const PrivateMenuScreen: React.FC<PrivateMenuScreenProps> = ({ navigation, isChef, currentUser }) => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    ingredients: '',
    preparationTime: '',
    image: null,
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Updated categories to match CourseScreen
  const categories = ['Hot plates', 'Cold plates', 'Baked goods', 'Beverages'];

  useEffect(() => {
    // Load saved drafts with updated categories
    const savedDrafts = [
      {
        id: '1',
        title: 'Braised Lamb Shank',
        description: 'Tender lamb slow-cooked in red wine and herbs',
        price: '34.99',
        category: 'Hot plates',
        ingredients: 'Lamb shank, red wine, fresh rosemary, garlic, carrots, potatoes',
        preparationTime: '180',
        status: 'draft',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Smoked Salmon Platter',
        description: 'House-smoked salmon with capers, red onion and crème fraîche',
        price: '22.99',
        category: 'Cold plates',
        ingredients: 'Smoked salmon, capers, red onion, crème fraîche, lemon, dill, rye bread',
        preparationTime: '15',
        status: 'draft',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: '3',
        title: 'Chocolate Éclairs',
        description: 'Choux pastry filled with vanilla cream and chocolate glaze',
        price: '7.99',
        category: 'Baked goods',
        ingredients: 'Choux pastry, vanilla pastry cream, dark chocolate, cream, powdered sugar',
        preparationTime: '120',
        status: 'draft',
        createdAt: new Date('2024-01-05'),
      }
    ];
    setDrafts(savedDrafts);
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    }

    if (!formData.preparationTime || isNaN(parseInt(formData.preparationTime)) || parseInt(formData.preparationTime) <= 0) {
      newErrors.preparationTime = 'Valid preparation time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      ingredients: '',
      preparationTime: '',
      image: null,
    });
    setErrors({});
    setEditingDraft(null);
  };

  const handleCreateDraft = () => {
    if (!validateForm()) return;

    const newDraft = {
      id: editingDraft ? editingDraft.id : Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      ingredients: formData.ingredients,
      preparationTime: formData.preparationTime,
      image: formData.image,
      status: 'draft',
      createdAt: editingDraft ? editingDraft.createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (editingDraft) {
      setDrafts(prev => prev.map(draft => draft.id === editingDraft.id ? newDraft : draft));
      Alert.alert('Success', 'Draft updated successfully!');
    } else {
      setDrafts(prev => [newDraft, ...prev]);
      Alert.alert('Success', 'New draft created successfully!');
    }

    setIsCreateModalVisible(false);
    resetForm();
  };

  const handleEditDraft = (draft: any) => {
    setEditingDraft(draft);
    setFormData({
      title: draft.title,
      description: draft.description,
      price: draft.price,
      category: draft.category,
      ingredients: draft.ingredients,
      preparationTime: draft.preparationTime,
      image: draft.image,
    });
    setIsCreateModalVisible(true);
  };

  const handleDeleteDraft = (draftId: string) => {
    Alert.alert(
      'Delete Draft',
      'Are you sure you want to delete this draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDrafts(prev => prev.filter(draft => draft.id !== draftId));
            Alert.alert('Success', 'Draft deleted successfully!');
          }
        }
      ]
    );
  };

  const handlePublishDraft = (draft: any) => {
    Alert.alert(
      'Publish Dish',
      `Ready to publish "${draft.title}" to the ${draft.category} menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: () => {
            setDrafts(prev => prev.filter(d => d.id !== draft.id));
            Alert.alert(
              'Published!', 
              `"${draft.title}" has been published to the ${draft.category} menu.`,
              [
                { 
                  text: 'View Menu', 
                  onPress: () => navigation.navigate('Courses') 
                },
                { text: 'OK', style: 'default' }
              ]
            );
          }
        }
      ]
    );
  };

  // Navigate back to Courses screen
  const handleBackPress = () => {
    navigation.navigate('Courses');
  };

  const renderDraftItem = ({ item }: { item: any }) => (
    <View style={styles.draftCard}>
      <View style={styles.draftHeader}>
        <Text style={styles.draftTitle}>{item.title}</Text>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: getCategoryColor(item.category) }
        ]}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      
      <Text style={styles.draftDescription}>{item.description}</Text>
      
      <View style={styles.draftDetails}>
        <View style={styles.priceContainer}>
          <Text style={styles.currencySymbol}>R</Text>
          <Text style={styles.draftPrice}>{item.price}</Text>
        </View>
        <Text style={styles.draftTime}>{item.preparationTime} mins</Text>
      </View>

      <Text style={styles.draftIngredients}>
        <Text style={styles.ingredientsLabel}>Ingredients: </Text>
        {item.ingredients}
      </Text>

      <View style={styles.draftActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditDraft(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.publishButton]}
          onPress={() => handlePublishDraft(item)}
        >
          <Text style={styles.actionButtonText}>Publish</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteDraft(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.draftDate}>
        Created: {item.createdAt.toLocaleDateString()}
      </Text>
    </View>
  );

  // Helper function for category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hot plates':
        return 'rgba(239, 68, 68, 0.9)'; // Red
      case 'Cold plates':
        return 'rgba(59, 130, 246, 0.9)'; // Blue
      case 'Baked goods':
        return 'rgba(234, 179, 8, 0.9)'; // Yellow
      case 'Beverages':
        return 'rgba(16, 185, 129, 0.9)'; // Green
      default:
        return 'rgba(236, 72, 153, 0.9)'; // Pink (default)
    }
  };

  if (!isChef) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedTitle}>🔒 Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            This section is only available for chefs. Please log in with chef credentials to access the private menu.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Courses')}
          >
            <Text style={styles.loginButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Chef's Kitchen</Text>
            <Text style={styles.headerSubtitle}>Private Menu Drafts</Text>
          </View>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{drafts.length}</Text>
            <Text style={styles.statLabel}>Total Drafts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {categories.reduce((count, category) => 
                count + (drafts.filter(d => d.category === category).length > 0 ? 1 : 0), 0
              )}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {drafts.length > 0 ? (
          <FlatList
            data={drafts}
            renderItem={renderDraftItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.draftsList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.listHeader}>
                Your Drafts ({drafts.length})
              </Text>
            }
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👨‍🍳</Text>
            <Text style={styles.emptyStateTitle}>No Drafts Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your culinary masterpieces here! Drafts will appear where you can edit and publish them when ready.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setIsCreateModalVisible(true)}
            >
              <Text style={styles.emptyStateButtonText}>Create First Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.backToMenuButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backToMenuButtonText}>Back to Courses</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={isCreateModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => {
            setIsCreateModalVisible(false);
            resetForm();
          }}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingDraft ? 'Edit Dish Draft' : 'Create New Dish'}
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setIsCreateModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                {/* Title */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Dish Title *</Text>
                  <TextInput
                    style={[styles.textInput, errors.title && styles.inputError]}
                    placeholder="Enter dish title"
                    value={formData.title}
                    onChangeText={(value) => handleInputChange('title', value)}
                    placeholderTextColor="#94a3b8"
                  />
                  {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>

                {/* Description */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description *</Text>
                  <TextInput
                    style={[styles.textArea, errors.description && styles.inputError]}
                    placeholder="Describe your dish"
                    value={formData.description}
                    onChangeText={(value) => handleInputChange('description', value)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholderTextColor="#94a3b8"
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                    <Text style={styles.inputLabel}>Price (R) *</Text>
                    <View style={styles.priceInputContainer}>
                      <Text style={styles.pricePrefix}>R</Text>
                      <TextInput
                        style={[styles.priceInput, errors.price && styles.inputError]}
                        placeholder="0.00"
                        value={formData.price}
                        onChangeText={(value) => handleInputChange('price', value)}
                        keyboardType="decimal-pad"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>
                    {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Prep Time (mins) *</Text>
                    <TextInput
                      style={[styles.textInput, errors.preparationTime && styles.inputError]}
                      placeholder="30"
                      value={formData.preparationTime}
                      onChangeText={(value) => handleInputChange('preparationTime', value)}
                      keyboardType="number-pad"
                      placeholderTextColor="#94a3b8"
                    />
                    {errors.preparationTime && <Text style={styles.errorText}>{errors.preparationTime}</Text>}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Category *</Text>
                  <Text style={styles.categorySubLabel}>
                    Choose one of the main course categories
                  </Text>
                  <View style={styles.categoriesGrid}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          formData.category === category && 
                          styles.categoryButtonSelected,
                          { borderColor: getCategoryColor(category) }
                        ]}
                        onPress={() => handleInputChange('category', category)}
                      >
                        <Text style={[
                          styles.categoryButtonText,
                          formData.category === category && styles.categoryButtonTextSelected
                        ]}>
                          {category}
                        </Text>
                        {formData.category === category && (
                          <Text style={styles.categoryCheck}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                </View>

                {/* Ingredients */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ingredients *</Text>
                  <Text style={styles.ingredientsHint}>
                    Separate ingredients with commas
                  </Text>
                  <TextInput
                    style={[styles.textArea, errors.ingredients && styles.inputError]}
                    placeholder="e.g., Chicken, garlic, olive oil, rosemary, salt"
                    value={formData.ingredients}
                    onChangeText={(value) => handleInputChange('ingredients', value)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholderTextColor="#94a3b8"
                  />
                  {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients}</Text>}
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setIsCreateModalVisible(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleCreateDraft}
                  >
                    <Text style={styles.saveButtonText}>
                      {editingDraft ? 'Update Draft' : 'Save as Draft'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e5e7eb',
    marginTop: 2,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#e5e7eb',
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  draftsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 32,
  },
  draftCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  draftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  draftTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
    letterSpacing: 0.5,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  draftDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  draftDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginRight: 2,
  },
  draftPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1f2937',
  },
  draftTime: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  draftIngredients: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 18,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  ingredientsLabel: {
    fontWeight: '700',
    color: '#1f2937',
  },
  draftActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
  },
  publishButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  draftDate: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '500',
  },
  emptyStateButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backToMenuButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backToMenuButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  accessDeniedTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ef4444',
    marginBottom: 16,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  modalScroll: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  closeButton: {
    fontSize: 24,
    color: '#e5e7eb',
    fontWeight: '300',
  },
  formContainer: {
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  categorySubLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
    fontWeight: '500',
  },
  ingredientsHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  pricePrefix: {
    fontSize: 16,
    color: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 14,
    paddingRight: 16,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  categoryButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    textAlign: 'center',
  },
  categoryButtonTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  categoryCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PrivateMenuScreen;
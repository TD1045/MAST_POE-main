import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal, Alert, FlatList, KeyboardAvoidingView, Platform, } from 'react-native';
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

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side Dish', 'Special'];

  useEffect(() => {
    const savedDrafts = [
      {
        id: '1',
        title: 'Spicy Tuna Roll',
        description: 'Fresh tuna with spicy mayo and cucumber',
        price: '14.99',
        category: 'Main Course',
        ingredients: 'Tuna, spicy mayo, cucumber, rice, nori',
        preparationTime: '20',
        status: 'draft',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        price: '8.99',
        category: 'Dessert',
        ingredients: 'Chocolate, flour, eggs, butter, sugar',
        preparationTime: '15',
        status: 'draft',
        createdAt: new Date('2024-01-10'),
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
      'Ready to publish this dish to the main menu?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: () => {
            setDrafts(prev => prev.filter(d => d.id !== draft.id));
            Alert.alert('Published!', 'Dish has been published to the main menu.');
          }
        }
      ]
    );
  };

  const renderDraftItem = ({ item }: { item: any }) => (
    <View style={styles.draftCard}>
      <View style={styles.draftHeader}>
        <Text style={styles.draftTitle}>{item.title}</Text>
        <Text style={styles.draftCategory}>{item.category}</Text>
      </View>
      
      <Text style={styles.draftDescription}>{item.description}</Text>
      
      <View style={styles.draftDetails}>
        <Text style={styles.draftPrice}>${item.price}</Text>
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

  if (!isChef) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            This section is only available for chefs. Please log in with chef credentials to access the private menu.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Private Menu</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.actionBar}>
          <Text style={styles.draftsCount}>
            {drafts.length} {drafts.length === 1 ? 'Draft' : 'Drafts'}
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Text style={styles.createButtonText}>+ New Draft</Text>
          </TouchableOpacity>
        </View>

        {drafts.length > 0 ? (
          <FlatList
            data={drafts}
            renderItem={renderDraftItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.draftsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Drafts Yet</Text>
            <Text style={styles.emptyStateText}>
              Start creating your culinary masterpieces! Your drafts will appear here where you can edit and publish them when ready.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setIsCreateModalVisible(true)}
            >
              <Text style={styles.emptyStateButtonText}>Create Your First Draft</Text>
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
                  {editingDraft ? 'Edit Draft' : 'Create New Draft'}
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
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price (R) *</Text>
                  <TextInput
                    style={[styles.textInput, errors.price && styles.inputError]}
                    placeholder="0.00"
                    value={formData.price}
                    onChangeText={(value) => handleInputChange('price', value)}
                    keyboardType="decimal-pad"
                  />
                  {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Category *</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                  >
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          formData.category === category && styles.categoryChipSelected
                        ]}
                        onPress={() => handleInputChange('category', category)}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          formData.category === category && styles.categoryChipTextSelected
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Preparation Time (Enter number of minutes) *</Text>
                  <TextInput
                    style={[styles.textInput, errors.preparationTime && styles.inputError]}
                    placeholder="30"
                    value={formData.preparationTime}
                    onChangeText={(value) => handleInputChange('preparationTime', value)}
                    keyboardType="number-pad"
                  />
                  {errors.preparationTime && <Text style={styles.errorText}>{errors.preparationTime}</Text>}
                </View>

                {/* Ingredients */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ingredients *</Text>
                  <TextInput
                    style={[styles.textArea, errors.ingredients && styles.inputError]}
                    placeholder="List ingredients separated by commas"
                    value={formData.ingredients}
                    onChangeText={(value) => handleInputChange('ingredients', value)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
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
                      {editingDraft ? 'Update Draft' : 'Save Draft'}
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
  headerPlaceholder: {
    width: 40,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  draftsCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  createButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  draftsList: {
    padding: 16,
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
    marginBottom: 8,
  },
  draftTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
    letterSpacing: 0.5,
  },
  draftCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  draftDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  draftDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  draftPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  draftTime: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  draftIngredients: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 18,
    fontWeight: '500',
  },
  ingredientsLabel: {
    fontWeight: '700',
    color: '#1f2937',
  },
  draftActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
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
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  accessDeniedTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ef4444',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 24,
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
    padding: 24,
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
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    minHeight: 80,
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
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
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
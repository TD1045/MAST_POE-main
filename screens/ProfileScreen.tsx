import React, { JSX, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface User {
  id: string;
  username: string;
  isChef: boolean;
}

type ProfileScreenProps = {
  navigation: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsChef: React.Dispatch<React.SetStateAction<boolean>>;
  isChef: boolean;
  currentUser: User | null;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  navigation,
  setCurrentUser,
  setIsChef,
  isChef,
  currentUser,
}): JSX.Element => {

  const [isSignupModalVisible, setIsSignupModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    isChef: false,
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ username: '', isChef: false });
    setErrors({});
  };

  const handleModalClose = () => {
    setIsSignupModalVisible(false);
    resetForm();
  };

  // Chef login handler - navigate to Private Menu
  const handleChefLogin = (user: User) => {
    navigation.navigate('PrivateMenu'); // Make sure this matches your screen name
  };

  // User login handler - navigate to User Menu
  const handleUserLogin = (user: User) => {
    navigation.navigate('UserMenu');
  };

  // Guest navigation - always go to Courses
  const handleGuestNavigation = () => {
    navigation.navigate('Courses');
  };

  const handleStartSession = () => {
    if (!validateForm()) return;

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      isChef: formData.isChef,
    };

    setCurrentUser(newUser);
    setIsChef(newUser.isChef);
    handleModalClose();
    
    // Navigate based on role
    if (newUser.isChef) {
      handleChefLogin(newUser);
    } else {
      handleUserLogin(newUser);
    }
  };

  const handleContinueAsGuest = () => {
    setCurrentUser(null);
    setIsChef(false);
    handleGuestNavigation();
  };

  const handleEndSession = () => {
    setCurrentUser(null);
    setIsChef(false);
    handleGuestNavigation(); // Go to Courses after ending session
  };

  const handleNavigateToMainScreen = () => {
    if (!currentUser) {
      handleGuestNavigation();
      return;
    }
    
    if (isChef) {
      handleChefLogin(currentUser);
    } else {
      handleUserLogin(currentUser);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Session Access</Text>
            {currentUser && (
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionStatus}>
                  {isChef ? '🔓 Chef Session Active' : '👤 User Session Active'}
                </Text>
                <Text style={styles.usernameText}>
                  {currentUser.username}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to MenuApp</Text>
            <Text style={styles.welcomeSubtitle}>
              {currentUser 
                ? `Currently signed in as ${currentUser.username}${isChef ? ' (Chef)' : ''}`
                : 'Sign in to access features. Data is not stored permanently.'
              }
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            {!currentUser ? (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => setIsSignupModalVisible(true)}
                >
                  <Text style={styles.primaryButtonText}>Start Session</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.tertiaryButton]}
                  onPress={handleContinueAsGuest}
                >
                  <Text style={styles.tertiaryButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleNavigateToMainScreen}
                >
                  <Text style={styles.primaryButtonText}>
                    {isChef ? 'Go to Chef Dashboard' : 'Browse Menu'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={handleEndSession}
                >
                  <Text style={styles.secondaryButtonText}>End Session</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>

        {/* Signup Modal */}
        <Modal
          visible={isSignupModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleModalClose}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Start Session</Text>
                <TouchableOpacity onPress={handleModalClose}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    style={[styles.textInput, errors.username && styles.inputError]}
                    placeholder="Enter username"
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Role</Text>
                  <View style={styles.radioContainer}>
                    <TouchableOpacity 
                      style={styles.radioOption}
                      onPress={() => handleInputChange('isChef', true)}
                    >
                      <View style={styles.radioCircle}>
                        {formData.isChef && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.radioLabel}>Chef</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.radioOption}
                      onPress={() => handleInputChange('isChef', false)}
                    >
                      <View style={styles.radioCircle}>
                        {!formData.isChef && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.radioLabel}>User</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleStartSession}
                >
                  <Text style={styles.submitButtonText}>
                    {formData.isChef ? 'Start Chef Session' : 'Start User Session'}
                  </Text>
                </TouchableOpacity>
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
     backgroundColor: '#1f2937' 
    },
  scrollContainer: { 
    flexGrow: 1 
    },
  header: { 
    paddingHorizontal: 24, 
    paddingVertical: 20 
    },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#fff', 
    textAlign: 'center' 
    },
  sessionInfo: { 
    alignItems: 'center', 
    marginTop: 8 
    },
  sessionStatus: { 
    fontSize: 12, 
    color: '#10b981', 
    textAlign: 'center' 
    },
  usernameText: { 
    fontSize: 14,  
    color: '#e5e7eb', 
    fontWeight: '600', 
    marginTop: 2 
    },
  welcomeSection: { 
    paddingHorizontal: 24, 
    paddingVertical: 32, 
    alignItems: 'center' 
    },
  welcomeTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 12 
    },
  welcomeSubtitle: { 
    fontSize: 16, 
    color: '#e5e7eb', 
    textAlign: 'center', 
    lineHeight: 24, 
    fontWeight: '500' 
    },
  actionsContainer: { 
    paddingHorizontal: 24, 
    marginBottom: 32 
    },
  actionButton: { 
    paddingVertical: 18, 
    paddingHorizontal: 24, 
    borderRadius: 16, 
    marginBottom: 16, 
    alignItems: 'center' 
    },
  primaryButton: { 
    backgroundColor: '#fb1c1ce6' 
    },
  primaryButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700' 
    },
  secondaryButton: { 
    backgroundColor: 'rgba(239, 68, 68, 0.9)' 
    },
  secondaryButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700' 
    },
  tertiaryButton: { 
    backgroundColor: 'transparent' 
    },
  tertiaryButtonText: { 
    color: '#e5e7eb', 
    fontSize: 16, 
    fontWeight: '600' 
    },
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#1f2937' 
    },
  modalScroll: { 
    flex: 1 
    },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 20 
    },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#fff' 
    },
  closeButton: { 
    fontSize: 24, 
    color: '#e5e7eb' 
    },
  formContainer: { 
    padding: 24 
    },
  inputGroup: { 
    marginBottom: 20 
    },
  inputLabel: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#e5e7eb', 
    marginBottom: 8 
    },
  textInput: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderWidth: 2, 
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 16, 
    color: '#fff' 
    },
  inputError: { 
    borderColor: '#ef4444' 
    },
  errorText: { 
    color: '#ef4444', 
    fontSize: 14, 
    marginTop: 4 
    },
  radioContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
    },
  radioOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1, 
    marginRight: 16 
    },
  radioCircle: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#e5e7eb', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8 
    },
  radioDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#e5e7eb' 
    },
  radioLabel: { 
    fontSize: 14, 
    color: '#e5e7eb', 
    fontWeight: '600' 
    },
  submitButton: { 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 8, 
    backgroundColor: 'rgba(236, 72, 153, 0.9)' 
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default ProfileScreen;
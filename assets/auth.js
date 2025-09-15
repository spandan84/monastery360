// Authentication JavaScript for Monastery360
// Firebase-aware auth service with graceful local fallback

// Configuration detection
const hasFirebaseSDK = typeof window !== 'undefined' && typeof window.firebase !== 'undefined';
const hasFirebaseConfig = typeof window !== 'undefined' && !!window.FIREBASE_CONFIG;
let firebaseInitialized = false;

// Initialize authentication
document.addEventListener('DOMContentLoaded', function () {
  initializeAuth();
});

function initializeAuth() {
  // Initialize Firebase if available and config provided
  if (hasFirebaseSDK && hasFirebaseConfig && !firebaseInitialized) {
    try {
      if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      firebaseInitialized = true;
      // Keep local profile in sync with Firebase auth state
      firebase.auth().onAuthStateChanged((fbUser) => {
        if (fbUser) {
          // Ensure local profile exists
          const profile = ensureLocalProfileForFirebaseUser(fbUser);
          // Persist currentUser for app code
          localStorage.setItem('currentUser', JSON.stringify(profile));
        } else {
          // Clear app session
          localStorage.removeItem('currentUser');
        }
      });
    } catch (err) {
      console.error('Firebase initialization failed. Falling back to local auth.', err);
      firebaseInitialized = false;
    }
  }

  // Check current page and setup appropriate handlers
  const currentPage = window.location.pathname.split('/').pop();

  if (currentPage === 'login.html') {
    setupLoginForm();
  } else if (currentPage === 'register.html') {
    setupRegistrationForm();
  }
}

// Login functionality
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Simple validation
  if (!email || !password) {
    showAuthError('Please fill in all required fields');
    return;
  }

  if (firebaseInitialized) {
    try {
      const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
      const fbUser = cred.user;
      const profile = ensureLocalProfileForFirebaseUser(fbUser);
      localStorage.setItem('currentUser', JSON.stringify(profile));
      showAuthSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        if (isAdminRole(profile.role)) {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'user-dashboard.html';
        }
      }, 1200);
    } catch (err) {
      console.error('Firebase auth error:', err);
      // Attempt local fallback (demo/local users)
      const users = JSON.parse(localStorage.getItem('monastery360Users') || '[]');
      const localUser = users.find((u) => u.email === email && u.password === password);
      if (localUser) {
        localStorage.setItem('currentUser', JSON.stringify(localUser));
        showAuthSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (isAdminRole(localUser.role)) {
            window.location.href = 'admin-dashboard.html';
          } else {
            window.location.href = 'user-dashboard.html';
          }
        }, 1200);
      } else {
        showAuthError(parseFirebaseAuthError(err));
      }
    }
    return;
  }

  // Local fallback (simulate authentication)
  const users = JSON.parse(localStorage.getItem('monastery360Users') || '[]');
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Successful login
    localStorage.setItem('currentUser', JSON.stringify(user));
    showAuthSuccess('Login successful! Redirecting...');

    // Redirect based on user role
    setTimeout(() => {
      if (isAdminRole(user.role)) {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    }, 1200);
  } else {
    showAuthError('Invalid email or password');
  }
}

// Social login handlers
async function socialLogin(provider) {
  if (firebaseInitialized) {
    try {
      let authProvider;
      if (provider === 'google') {
        authProvider = new firebase.auth.GoogleAuthProvider();
      } else if (provider === 'facebook') {
        authProvider = new firebase.auth.FacebookAuthProvider();
      } else {
        showAuthError('Unsupported provider');
        return;
      }

      const cred = await firebase.auth().signInWithPopup(authProvider);
      const fbUser = cred.user;
      // Ensure local profile exists (default role tourist)
      const profile = ensureLocalProfileForFirebaseUser(fbUser, { defaultRole: 'tourist' });
      localStorage.setItem('currentUser', JSON.stringify(profile));

      showAuthSuccess(`${provider} login successful! Redirecting...`);
      setTimeout(() => {
        window.location.href = 'user-dashboard.html';
      }, 1200);
      return;
    } catch (err) {
      console.error('Social login error:', err);
      showAuthError(parseFirebaseAuthError(err));
      return;
    }
  }

  // Fallback: mock social login
  const mockUser = {
    id: 'social_' + Date.now(),
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe@${provider}.com`,
    role: 'tourist',
    provider: provider,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem('currentUser', JSON.stringify(mockUser));
  showAuthSuccess(`${provider} login successful! Redirecting...`);
  setTimeout(() => {
    window.location.href = 'user-dashboard.html';
  }, 1200);
}

// Registration functionality
function setupRegistrationForm() {
  const registrationForm = document.getElementById('register-form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleRegistration);
  }
}

async function handleRegistration(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const userData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    role: formData.get('userRole'),
  };

  // Validation
  if (!validateRegistrationData(userData)) {
    return;
  }

  if (firebaseInitialized) {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('monastery360Users') || '[]');
      if (existingUsers.find((u) => u.email === userData.email)) {
        // Do not block based on local; Firebase will enforce unique emails anyway, but keep UX consistent
        showAuthError('An account with this email already exists');
        return;
      }

      const cred = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password);
      const fbUser = cred.user;

      // Update display name
      try {
        await fbUser.updateProfile({ displayName: `${userData.firstName} ${userData.lastName}`.trim() });
      } catch (_) {}

      // Create local profile reflecting role and additional fields
      const profile = createLocalProfileFromFirebaseUser(fbUser, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'tourist',
      });

      localStorage.setItem('currentUser', JSON.stringify(profile));
      showAuthSuccess('Registration successful! Redirecting to your dashboard...');

      setTimeout(() => {
        if (isAdminRole(profile.role)) {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'user-dashboard.html';
        }
      }, 1500);
      return;
    } catch (err) {
      console.error('Firebase registration error:', err);
      showAuthError(parseFirebaseAuthError(err));
      return;
    }
  }

  // Local fallback - previous behavior
  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('monastery360Users') || '[]');
  if (existingUsers.find((u) => u.email === userData.email)) {
    showAuthError('An account with this email already exists');
    return;
  }

  // Create new user
  const newUser = {
    id: 'user_' + Date.now(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password, // In real app, this should be hashed
    role: userData.role || 'tourist',
    createdAt: new Date().toISOString(),
    preferences: {
      newsletter: formData.get('newsletter') ? true : false,
    },
  };

  // Save user
  existingUsers.push(newUser);
  localStorage.setItem('monastery360Users', JSON.stringify(existingUsers));
  localStorage.setItem('currentUser', JSON.stringify(newUser));

  showAuthSuccess('Registration successful! Redirecting to your dashboard...');

  // Redirect to appropriate dashboard
  setTimeout(() => {
    if (isAdminRole(newUser.role)) {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'user-dashboard.html';
    }
  }, 1500);
}

// Social registration (same as social login)
function socialRegister(provider) {
  socialLogin(provider);
}

// Helpers for Firebase/local profile bridging
function ensureLocalProfileForFirebaseUser(fbUser, opts = {}) {
  const users = JSON.parse(localStorage.getItem('monastery360Users') || '[]');
  let user = null;

  // Prefer matching by uid if stored
  user = users.find((u) => u.uid && u.uid === fbUser.uid);
  if (!user) {
    // Fallback to email match
    user = users.find((u) => u.email && fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase());
  }

  if (!user) {
    // Create new profile
    user = createLocalProfileFromFirebaseUser(fbUser, {
      role: opts.defaultRole || 'tourist',
    });
  } else {
    // Ensure core fields are up to date
    let updated = false;
    if (!user.uid) {
      user.uid = fbUser.uid;
      updated = true;
    }
    if ((fbUser.displayName || '').trim()) {
      const [fn, ...rest] = fbUser.displayName.split(' ');
      const ln = rest.join(' ');
      if (!user.firstName) {
        user.firstName = fn;
        updated = true;
      }
      if (!user.lastName && ln) {
        user.lastName = ln;
        updated = true;
      }
    }
    if (updated) {
      const idx = users.findIndex((u) => (u.uid && u.uid === fbUser.uid) || (u.email && fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase()));
      if (idx >= 0) {
        users[idx] = user;
        localStorage.setItem('monastery360Users', JSON.stringify(users));
      }
    }
  }

  return user;
}

function createLocalProfileFromFirebaseUser(fbUser, extra = {}) {
  const users = JSON.parse(localStorage.getItem('monastery360Users') || '[]');

  let firstName = extra.firstName;
  let lastName = extra.lastName;
  if ((!firstName || !lastName) && fbUser.displayName) {
    const parts = fbUser.displayName.trim().split(' ');
    firstName = firstName || parts[0] || '';
    lastName = lastName || parts.slice(1).join(' ');
  }
  if (!firstName && fbUser.email) {
    firstName = fbUser.email.split('@')[0];
  }

  const newProfile = {
    id: fbUser.uid, // use uid as id for uniqueness
    uid: fbUser.uid,
    firstName: firstName || 'User',
    lastName: lastName || '',
    email: fbUser.email || '',
    role: extra.role || 'tourist',
    provider: (fbUser.providerData && fbUser.providerData[0] && fbUser.providerData[0].providerId) || 'password',
    createdAt: new Date().toISOString(),
  };

  users.push(newProfile);
  localStorage.setItem('monastery360Users', JSON.stringify(users));
  return newProfile;
}

function parseFirebaseAuthError(err) {
  if (!err || !err.code) return 'Authentication failed. Please try again.';
  const code = String(err.code);
  const map = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password is too weak',
    'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the sign in',
    'auth/cancelled-popup-request': 'Popup request was cancelled. Please try again',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email address',
    'auth/operation-not-allowed': 'This sign-in method is not enabled for this project',
  };
  return map[code] || 'Authentication error: ' + code;
}

// Validation functions
function validateRegistrationData(userData) {
  if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
    showAuthError('Please fill in all required fields');
    return false;
  }

  if (!isValidEmail(userData.email)) {
    showAuthError('Please enter a valid email address');
    return false;
  }

  if (userData.password.length < 6) {
    showAuthError('Password must be at least 6 characters long');
    return false;
  }

  if (userData.password !== userData.confirmPassword) {
    showAuthError('Passwords do not match');
    return false;
  }

  if (!userData.role) {
    showAuthError('Please select your role');
    return false;
  }

  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isAdminRole(role) {
  const adminRoles = ['monk', 'archivist', 'tourism_official', 'super_admin'];
  return adminRoles.includes(role);
}

// UI feedback functions
function showAuthError(message) {
  removeExistingAlerts();

  const alert = document.createElement('div');
  alert.className = 'fixed top-4 right-4 bg-prayer-red text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  alert.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/80 hover:text-white">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `;

  document.body.appendChild(alert);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

function showAuthSuccess(message) {
  removeExistingAlerts();

  const alert = document.createElement('div');
  alert.className = 'fixed top-4 right-4 bg-prayer-green text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  alert.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(alert);

  // Auto remove after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function removeExistingAlerts() {
  const existingAlerts = document.querySelectorAll('.fixed.top-4.right-4');
  existingAlerts.forEach((alert) => alert.remove());
}

// Logout functionality
async function logout() {
  if (firebaseInitialized) {
    try {
      await firebase.auth().signOut();
    } catch (err) {
      console.warn('Firebase signOut error (ignorable if already signed out):', err);
    }
  }
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Check authentication status (based on our session mirror)
function isAuthenticated() {
  return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Role-based access control
function hasRole(requiredRole) {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
}

function hasAnyRole(requiredRoles) {
  const user = getCurrentUser();
  return user && requiredRoles.includes(user.role);
}

// Protected route helper
function requireAuth(redirectUrl = 'login.html') {
  if (!isAuthenticated()) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

function requireRole(requiredRole, redirectUrl = 'user-dashboard.html') {
  if (!hasRole(requiredRole)) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

// Initialize demo users for demo/local fallback
function initializeDemoUsers() {
  const existingUsers = JSON.parse(localStorage.getItem('monastery360Users') || '[]');

  if (existingUsers.length === 0) {
    const demoUsers = [
      {
        id: 'admin_1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@monastery360.com',
        password: 'admin123',
        role: 'super_admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'monk_1',
        firstName: 'Lama',
        lastName: 'Tenzin',
        email: 'tenzin@rumtek.monastery',
        password: 'monk123',
        role: 'monk',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'tourist_1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'tourist',
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem('monastery360Users', JSON.stringify(demoUsers));
  }
}

// Initialize demo users on script load (only affects local fallback)
initializeDemoUsers();

// Export functions for global use
window.Auth = {
  login: handleLogin,
  logout,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  hasAnyRole,
  requireAuth,
  requireRole,
  socialLogin,
  socialRegister,
};
// Admin Dashboard JavaScript for Monastery360

// Initialize admin functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Check if user is authenticated and has admin role
    const user = getCurrentUser();
    if (!user || !isAdminRole(user.role)) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update admin info in UI
    updateAdminUI(user);
    
    // Setup admin event listeners
    setupAdminEventListeners();
    
    // Load admin data
    loadAdminData();
}

function updateAdminUI(user) {
    const adminName = document.getElementById('admin-name');
    const adminInitials = document.getElementById('admin-initials');
    const dropdownAdminName = document.getElementById('dropdown-admin-name');
    const dropdownAdminRole = document.getElementById('dropdown-admin-role');
    
    if (adminName) adminName.textContent = `${user.firstName} ${user.lastName}`;
    if (adminInitials) adminInitials.textContent = `${user.firstName[0]}${user.lastName[0]}`;
    if (dropdownAdminName) dropdownAdminName.textContent = `${user.firstName} ${user.lastName}`;
    if (dropdownAdminRole) dropdownAdminRole.textContent = getRoleDisplayName(user.role);
}

function getRoleDisplayName(role) {
    const roleNames = {
        'super_admin': 'Super Admin',
        'monk': 'Monk',
        'archivist': 'Archivist',
        'tourism_official': 'Tourism Official'
    };
    return roleNames[role] || 'Admin';
}

function setupAdminEventListeners() {
    // Admin menu toggle
    const adminMenuTrigger = document.getElementById('admin-menu-trigger');
    const adminMenu = document.getElementById('admin-menu');
    
    if (adminMenuTrigger && adminMenu) {
        adminMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            adminMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', function() {
            adminMenu.classList.add('hidden');
        });
    }
    
    // Tab navigation
    setupTabNavigation();
}

function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('href').substring(1);
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tab links
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active', 'bg-prayer-blue/10', 'text-prayer-blue');
        link.classList.add('text-gray-700');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
    
    // Activate selected tab link
    const selectedLink = document.querySelector(`[href="#${tabName}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active', 'bg-prayer-blue/10', 'text-prayer-blue');
        selectedLink.classList.remove('text-gray-700');
    }
    
    // Load tab-specific content
    loadTabContent(tabName);
}

function loadTabContent(tabName) {
    switch (tabName) {
        case 'monasteries':
            loadMonasteriesContent();
            break;
        case 'archives':
            loadArchivesContent();
            break;
        case 'calendar':
            loadCalendarContent();
            break;
        case 'users':
            loadUsersContent();
            break;
        case 'analytics':
            loadAnalyticsContent();
            break;
    }
}

function loadAdminData() {
    // Load dashboard statistics
    updateDashboardStats();
    
    // Load recent activity
    loadRecentActivity();
}

function updateDashboardStats() {
    // Mock data - in real app, this would come from API
    const stats = {
        totalMonasteries: 25,
        activeUsers: 1245,
        digitalArchives: 500,
        upcomingEvents: 12
    };
    
    // Update stats in UI (if elements exist)
    // This would be implemented based on the specific dashboard layout
}

function loadRecentActivity() {
    // Mock recent activity data
    const activities = [
        {
            type: 'monastery_added',
            user: 'Monk Tenzin',
            description: 'New monastery added',
            details: 'Tashiding Monastery',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            type: 'archive_uploaded',
            user: 'Archivist Pema',
            description: 'Archive uploaded',
            details: '15th century manuscript',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
            type: 'user_registered',
            user: 'System',
            description: 'New user registered',
            details: 'Tourist from Delhi joined',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        }
    ];
    
    // Store activities for use in UI
    localStorage.setItem('recentActivities', JSON.stringify(activities));
}

// Content loading functions for different tabs
function loadMonasteriesContent() {
    const monasteries = getFromLocalStorage('monasteries', []);
    // Implementation would populate the monasteries management interface
    console.log('Loading monasteries content:', monasteries);
}

function loadArchivesContent() {
    const archives = getFromLocalStorage('archives', []);
    // Implementation would populate the archives management interface
    console.log('Loading archives content:', archives);
}

function loadCalendarContent() {
    const events = getFromLocalStorage('calendarEvents', []);
    // Implementation would populate the calendar management interface
    console.log('Loading calendar content:', events);
}

function loadUsersContent() {
    const users = getFromLocalStorage('monastery360Users', []);
    // Implementation would populate the user management interface
    console.log('Loading users content:', users);
}

function loadAnalyticsContent() {
    const analytics = getFromLocalStorage('analytics', {});
    // Implementation would populate the analytics dashboard
    console.log('Loading analytics content:', analytics);
}

// Monastery management functions
function addMonastery(monasteryData) {
    const monasteries = getFromLocalStorage('monasteries', []);
    const newMonastery = {
        id: 'monastery_' + Date.now(),
        ...monasteryData,
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUser().id
    };
    
    monasteries.push(newMonastery);
    saveToLocalStorage('monasteries', monasteries);
    
    // Log activity
    logActivity('monastery_added', `Added ${newMonastery.name}`);
    
    return newMonastery;
}

function updateMonastery(monasteryId, updates) {
    const monasteries = getFromLocalStorage('monasteries', []);
    const index = monasteries.findIndex(m => m.id === monasteryId);
    
    if (index !== -1) {
        monasteries[index] = {
            ...monasteries[index],
            ...updates,
            updatedAt: new Date().toISOString(),
            updatedBy: getCurrentUser().id
        };
        
        saveToLocalStorage('monasteries', monasteries);
        logActivity('monastery_updated', `Updated ${monasteries[index].name}`);
        
        return monasteries[index];
    }
    
    return null;
}

function deleteMonastery(monasteryId) {
    const monasteries = getFromLocalStorage('monasteries', []);
    const monastery = monasteries.find(m => m.id === monasteryId);
    
    if (monastery) {
        const updatedMonasteries = monasteries.filter(m => m.id !== monasteryId);
        saveToLocalStorage('monasteries', updatedMonasteries);
        logActivity('monastery_deleted', `Deleted ${monastery.name}`);
        return true;
    }
    
    return false;
}

// Archive management functions
function addArchive(archiveData) {
    const archives = getFromLocalStorage('archives', []);
    const newArchive = {
        id: 'archive_' + Date.now(),
        ...archiveData,
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUser().id
    };
    
    archives.push(newArchive);
    saveToLocalStorage('archives', archives);
    
    logActivity('archive_added', `Added archive: ${newArchive.title}`);
    
    return newArchive;
}

// Event management functions
function addEvent(eventData) {
    const events = getFromLocalStorage('calendarEvents', []);
    const newEvent = {
        id: 'event_' + Date.now(),
        ...eventData,
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUser().id
    };
    
    events.push(newEvent);
    saveToLocalStorage('calendarEvents', events);
    
    logActivity('event_added', `Added event: ${newEvent.title}`);
    
    return newEvent;
}

// User management functions
function updateUserRole(userId, newRole) {
    const users = getFromLocalStorage('monastery360Users', []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        const oldRole = users[userIndex].role;
        users[userIndex].role = newRole;
        users[userIndex].updatedAt = new Date().toISOString();
        
        saveToLocalStorage('monastery360Users', users);
        logActivity('user_role_updated', `Changed ${users[userIndex].firstName} ${users[userIndex].lastName} role from ${oldRole} to ${newRole}`);
        
        return users[userIndex];
    }
    
    return null;
}

function deactivateUser(userId) {
    const users = getFromLocalStorage('monastery360Users', []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].active = false;
        users[userIndex].deactivatedAt = new Date().toISOString();
        users[userIndex].deactivatedBy = getCurrentUser().id;
        
        saveToLocalStorage('monastery360Users', users);
        logActivity('user_deactivated', `Deactivated user: ${users[userIndex].firstName} ${users[userIndex].lastName}`);
        
        return users[userIndex];
    }
    
    return null;
}

// Activity logging
function logActivity(type, description, details = null) {
    const activities = getFromLocalStorage('adminActivities', []);
    const activity = {
        id: 'activity_' + Date.now(),
        type,
        description,
        details,
        user: getCurrentUser(),
        timestamp: new Date().toISOString()
    };
    
    activities.unshift(activity); // Add to beginning
    
    // Keep only last 100 activities
    if (activities.length > 100) {
        activities.splice(100);
    }
    
    saveToLocalStorage('adminActivities', activities);
}

// Analytics functions
function generateAnalytics() {
    const users = getFromLocalStorage('monastery360Users', []);
    const monasteries = getFromLocalStorage('monasteries', []);
    const archives = getFromLocalStorage('archives', []);
    const activities = getFromLocalStorage('adminActivities', []);
    
    const analytics = {
        userStats: {
            total: users.length,
            byRole: users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {}),
            newThisMonth: users.filter(u => {
                const created = new Date(u.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length
        },
        monasteryStats: {
            total: monasteries.length,
            withVirtualTours: monasteries.filter(m => m.hasVirtualTour).length,
            withArchives: monasteries.filter(m => m.hasArchives).length
        },
        archiveStats: {
            total: archives.length,
            byType: archives.reduce((acc, archive) => {
                acc[archive.type] = (acc[archive.type] || 0) + 1;
                return acc;
            }, {}),
            totalDownloads: archives.reduce((sum, archive) => sum + (archive.downloads || 0), 0)
        },
        activityStats: {
            totalActivities: activities.length,
            thisWeek: activities.filter(a => {
                const activityDate = new Date(a.timestamp);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return activityDate > weekAgo;
            }).length
        },
        generatedAt: new Date().toISOString()
    };
    
    saveToLocalStorage('analytics', analytics);
    return analytics;
}

// Data backup and restore
function backupData() {
    const data = {
        monasteries: getFromLocalStorage('monasteries', []),
        archives: getFromLocalStorage('archives', []),
        users: getFromLocalStorage('monastery360Users', []),
        events: getFromLocalStorage('calendarEvents', []),
        activities: getFromLocalStorage('adminActivities', []),
        analytics: getFromLocalStorage('analytics', {}),
        backupDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `monastery360_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    logActivity('data_backup', 'Created data backup');
}

function restoreData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate backup data structure
            if (!data.backupDate) {
                throw new Error('Invalid backup file format');
            }
            
            // Restore data
            if (data.monasteries) saveToLocalStorage('monasteries', data.monasteries);
            if (data.archives) saveToLocalStorage('archives', data.archives);
            if (data.users) saveToLocalStorage('monastery360Users', data.users);
            if (data.events) saveToLocalStorage('calendarEvents', data.events);
            if (data.activities) saveToLocalStorage('adminActivities', data.activities);
            if (data.analytics) saveToLocalStorage('analytics', data.analytics);
            
            logActivity('data_restore', `Restored data from backup dated ${data.backupDate}`);
            
            showNotification('Data restored successfully!', 'success');
            
            // Refresh the page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error('Error restoring data:', error);
            showNotification('Error restoring data: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Logout function
function adminLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Utility functions
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function isAdminRole(role) {
    const adminRoles = ['monk', 'archivist', 'tourism_official', 'super_admin'];
    return adminRoles.includes(role);
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function showNotification(message, type = 'info') {
    // Reuse the notification function from app.js
    if (window.Monastery360 && window.Monastery360.showNotification) {
        window.Monastery360.showNotification(message, type);
    } else {
        alert(message); // Fallback
    }
}

// Export admin functions
window.Admin = {
    addMonastery,
    updateMonastery,
    deleteMonastery,
    addArchive,
    addEvent,
    updateUserRole,
    deactivateUser,
    generateAnalytics,
    backupData,
    restoreData,
    logActivity
};
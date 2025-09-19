// Firebase Configuration Module for FreshKeep
// This module handles Firebase initialization and provides data management utilities

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    where,
    setDoc,
    getDoc,
    updateDoc
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

// Firebase configuration
// Replace with your actual Firebase config from console.firebase.google.com
const firebaseConfig = {
    apiKey: "AIzaSyDlhIJzu9Ln_R2fAAgakKfFzzJgTDzautE",
    authDomain: "freshkeep-34a12.firebaseapp.com",
    projectId: "freshkeep-34a12",
    storageBucket: "freshkeep-34a12.firebasestorage.app",
    messagingSenderId: "332100833248",
    appId: "1:332100833248:web:e920634dc1485dfdcda585",
    measurementId: "G-WBKNQGT7JJ"
};

class FreshKeepDB {
    constructor() {
        this.isOnline = false;
        this.db = null;
        this.auth = null;
        this.app = null;
        this.listeners = [];
        this.init();
    }

    async init() {
        try {
            // Initialize Firebase
            this.app = initializeApp(firebaseConfig);
            this.db = getFirestore(this.app);
            this.auth = getAuth(this.app);

            // Test connection
            await this.testConnection();
            this.isOnline = true;

            console.log('✅ Firebase initialized successfully');
            this.updateConnectionStatus('firebase');

        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            this.isOnline = false;
            this.updateConnectionStatus('local');
        }
    }

    async testConnection() {
        if (!this.db) throw new Error('Firestore not initialized');

        // Simple test to verify connection
        const testQuery = query(collection(this.db, 'items'), orderBy('dateAdded', 'desc'));
        await getDocs(testQuery);
    }

    // Data Management Methods
    async addItem(item) {
        if (this.isOnline && this.db) {
            try {
                const docRef = await addDoc(collection(this.db, 'items'), {
                    ...item,
                    userId: this.getCurrentUserId(),
                    dateAdded: new Date(),
                    syncStatus: 'synced'
                });
                console.log('✅ Item added to Firebase:', docRef.id);
                return docRef.id;
            } catch (error) {
                console.error('❌ Firebase add error:', error);
                return this.addItemToLocalStorage(item);
            }
        } else {
            return this.addItemToLocalStorage(item);
        }
    }

    async getItems() {
        if (this.isOnline && this.db) {
            try {
                const q = query(
                    collection(this.db, 'items'),
                    where('userId', '==', this.getCurrentUserId()),
                    orderBy('dateAdded', 'desc')
                );
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sync to localStorage as backup
                this.syncToLocalStorage(items);
                return items;
            } catch (error) {
                console.error('❌ Firebase get error:', error);
                return this.getItemsFromLocalStorage();
            }
        } else {
            return this.getItemsFromLocalStorage();
        }
    }

    async deleteItem(itemId) {
        if (this.isOnline && this.db) {
            try {
                await deleteDoc(doc(this.db, 'items', itemId));
                console.log('✅ Item deleted from Firebase:', itemId);
            } catch (error) {
                console.error('❌ Firebase delete error:', error);
            }
        }

        // Always update localStorage
        this.deleteItemFromLocalStorage(itemId);
    }

    async updateItem(itemId, updates) {
        if (this.isOnline && this.db) {
            try {
                await updateDoc(doc(this.db, 'items', itemId), {
                    ...updates,
                    lastModified: new Date(),
                    syncStatus: 'synced'
                });
                console.log('✅ Item updated in Firebase:', itemId);
            } catch (error) {
                console.error('❌ Firebase update error:', error);
            }
        }

        // Always update localStorage
        this.updateItemInLocalStorage(itemId, updates);
    }

    // Local Storage Fallback Methods
    addItemToLocalStorage(item) {
        const items = this.getItemsFromLocalStorage();
        const newItem = {
            ...item,
            id: Date.now().toString(),
            dateAdded: new Date().toISOString(),
            syncStatus: this.isOnline ? 'synced' : 'pending'
        };
        items.push(newItem);
        localStorage.setItem('freshkeep-items', JSON.stringify(items));
        console.log('💾 Item added to localStorage:', newItem.id);
        return newItem.id;
    }

    getItemsFromLocalStorage() {
        const stored = localStorage.getItem('freshkeep-items') || '[]';
        return JSON.parse(stored);
    }

    deleteItemFromLocalStorage(itemId) {
        const items = this.getItemsFromLocalStorage();
        const filtered = items.filter(item => item.id !== itemId);
        localStorage.setItem('freshkeep-items', JSON.stringify(filtered));
        console.log('💾 Item deleted from localStorage:', itemId);
    }

    updateItemInLocalStorage(itemId, updates) {
        const items = this.getItemsFromLocalStorage();
        const index = items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates, lastModified: new Date().toISOString() };
            localStorage.setItem('freshkeep-items', JSON.stringify(items));
            console.log('💾 Item updated in localStorage:', itemId);
        }
    }

    syncToLocalStorage(items) {
        localStorage.setItem('freshkeep-items', JSON.stringify(items));
        console.log('🔄 Synced', items.length, 'items to localStorage');
    }

    // Utility Methods
    getCurrentUserId() {
        if (this.auth && this.auth.currentUser) {
            return this.auth.currentUser.uid;
        }
        // For guest users, use a device-specific ID
        let deviceId = localStorage.getItem('freshkeep-device-id');
        if (!deviceId) {
            deviceId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('freshkeep-device-id', deviceId);
        }
        return deviceId;
    }

    updateConnectionStatus(type) {
        const statusEl = document.getElementById('connectionStatus');
        if (!statusEl) return;

        if (type === 'firebase') {
            statusEl.textContent = '☁️ Connected to Firebase';
            statusEl.style.background = 'var(--success-container)';
            statusEl.style.color = 'var(--on-success-container)';
        } else {
            statusEl.textContent = '💾 Offline Mode (Local Storage)';
            statusEl.style.background = 'var(--warning-container)';
            statusEl.style.color = 'var(--on-warning-container)';
        }
    }

    // Sync pending items when online
    async syncPendingItems() {
        if (!this.isOnline || !this.db) return;

        const items = this.getItemsFromLocalStorage();
        const pendingItems = items.filter(item => item.syncStatus === 'pending');

        console.log('🔄 Syncing', pendingItems.length, 'pending items...');

        for (const item of pendingItems) {
            try {
                const docRef = await addDoc(collection(this.db, 'items'), {
                    ...item,
                    userId: this.getCurrentUserId(),
                    syncStatus: 'synced'
                });

                // Update local storage with Firebase ID
                this.updateItemInLocalStorage(item.id, {
                    firebaseId: docRef.id,
                    syncStatus: 'synced'
                });

                console.log('✅ Synced item:', item.name);
            } catch (error) {
                console.error('❌ Failed to sync item:', item.name, error);
            }
        }
    }
}

// Initialize and export the database instance
window.FreshKeepDB = new FreshKeepDB();

// Export for module usage
export default window.FreshKeepDB;
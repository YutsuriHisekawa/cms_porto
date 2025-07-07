import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    let user = null
    let token = null
    let isAuthenticated = false
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      const tokenStr = localStorage.getItem('auth-token')
      if (userStr && tokenStr) {
        user = JSON.parse(userStr)
        token = tokenStr
        isAuthenticated = true
      }
    }
    return {
      user,
      token,
      isAuthenticated
    }
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data
        const mockUser = {
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
        }
        
        this.user = mockUser
        this.token = 'mock-jwt-token'
        this.isAuthenticated = true
        
        // Store in localStorage
        if (process.client) {
          localStorage.setItem('auth-token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Login failed' }
      }
    },

    async register(userData: { name: string; email: string; password: string }) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUser = {
          id: '1',
          email: userData.email,
          name: userData.name,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
        }
        
        this.user = mockUser
        this.token = 'mock-jwt-token'
        this.isAuthenticated = true
        
        // Store in localStorage
        if (process.client) {
          localStorage.setItem('auth-token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Registration failed' }
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      if (process.client) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth')
      }
      await navigateTo('/login')
    },

    async checkAuth(showError = false) {
      if (process.client) {
        const token = localStorage.getItem('auth-token')
        const user = localStorage.getItem('user')
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        } else {
          this.logout()
        }
      }
    }
  }
})
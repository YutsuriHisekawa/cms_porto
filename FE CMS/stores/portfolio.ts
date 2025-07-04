import { defineStore } from 'pinia'

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface Portfolio {
  id: string
  title: string
  description: string
  projects: Project[]
  createdAt: string
  updatedAt: string
}

interface PortfolioState {
  portfolios: Portfolio[]
  currentPortfolio: Portfolio | null
  isLoading: boolean
}

export const usePortfolioStore = defineStore('portfolio', {
  state: (): PortfolioState => ({
    portfolios: [],
    currentPortfolio: null,
    isLoading: false
  }),

  getters: {
    getPortfolioById: (state) => (id: string) => {
      return state.portfolios.find(p => p.id === id)
    },
    getFeaturedProjects: (state) => {
      return state.portfolios.flatMap(p => p.projects.filter(project => project.featured))
    }
  },

  actions: {
    async fetchPortfolios() {
      this.isLoading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        this.portfolios = [
          {
            id: '1',
            title: 'Web Development Portfolio',
            description: 'Collection of web development projects',
            projects: [
              {
                id: '1',
                title: 'E-commerce Platform',
                description: 'Full-stack e-commerce solution with React and Node.js',
                image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
                technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
                demoUrl: 'https://example.com',
                githubUrl: 'https://github.com/example',
                featured: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
              },
              {
                id: '2',
                title: 'Task Management App',
                description: 'Collaborative task management application',
                image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
                technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
                demoUrl: 'https://example.com',
                githubUrl: 'https://github.com/example',
                featured: false,
                createdAt: '2024-01-02T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z'
              }
            ],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      } catch (error) {
        console.error('Failed to fetch portfolios:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createPortfolio(portfolioData: Omit<Portfolio, 'id' | 'projects' | 'createdAt' | 'updatedAt'>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newPortfolio: Portfolio = {
          id: Date.now().toString(),
          ...portfolioData,
          projects: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        this.portfolios.push(newPortfolio)
        return { success: true, portfolio: newPortfolio }
      } catch (error) {
        return { success: false, error: 'Failed to create portfolio' }
      }
    },

    async updatePortfolio(id: string, portfolioData: Partial<Portfolio>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.portfolios.findIndex(p => p.id === id)
        if (index !== -1) {
          this.portfolios[index] = {
            ...this.portfolios[index],
            ...portfolioData,
            updatedAt: new Date().toISOString()
          }
          return { success: true }
        }
        return { success: false, error: 'Portfolio not found' }
      } catch (error) {
        return { success: false, error: 'Failed to update portfolio' }
      }
    },

    async deletePortfolio(id: string) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.portfolios.findIndex(p => p.id === id)
        if (index !== -1) {
          this.portfolios.splice(index, 1)
          return { success: true }
        }
        return { success: false, error: 'Portfolio not found' }
      } catch (error) {
        return { success: false, error: 'Failed to delete portfolio' }
      }
    },

    async createProject(portfolioId: string, projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const portfolioIndex = this.portfolios.findIndex(p => p.id === portfolioId)
        if (portfolioIndex !== -1) {
          const newProject: Project = {
            id: Date.now().toString(),
            ...projectData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          this.portfolios[portfolioIndex].projects.push(newProject)
          this.portfolios[portfolioIndex].updatedAt = new Date().toISOString()
          
          return { success: true, project: newProject }
        }
        return { success: false, error: 'Portfolio not found' }
      } catch (error) {
        return { success: false, error: 'Failed to create project' }
      }
    },

    async updateProject(portfolioId: string, projectId: string, projectData: Partial<Project>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const portfolioIndex = this.portfolios.findIndex(p => p.id === portfolioId)
        if (portfolioIndex !== -1) {
          const projects = this.portfolios[portfolioIndex].projects || []
          const projectIndex = projects.findIndex(p => p.id === projectId)
          if (projectIndex !== -1) {
            projects[projectIndex] = {
              ...projects[projectIndex],
              ...projectData,
              updatedAt: new Date().toISOString()
            }
            this.portfolios[portfolioIndex].projects = projects
            this.portfolios[portfolioIndex].updatedAt = new Date().toISOString()
            return { success: true }
          }
        }
        return { success: false, error: 'Project not found' }
      } catch (error) {
        return { success: false, error: 'Failed to update project' }
      }
    },

    async deleteProject(portfolioId: string, projectId: string) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const portfolioIndex = this.portfolios.findIndex(p => p.id === portfolioId)
        if (portfolioIndex !== -1) {
          const projects = this.portfolios[portfolioIndex].projects || []
          const projectIndex = projects.findIndex(p => p.id === projectId)
          if (projectIndex !== -1) {
            projects.splice(projectIndex, 1)
            this.portfolios[portfolioIndex].projects = projects
            this.portfolios[portfolioIndex].updatedAt = new Date().toISOString()
            return { success: true }
          }
        }
        return { success: false, error: 'Project not found' }
      } catch (error) {
        return { success: false, error: 'Failed to delete project' }
      }
    }
  }
})
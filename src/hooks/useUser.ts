import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UseUserReturn {
  isAdmin: boolean
  loading: boolean
  user: {
    id: string
    name?: string | null
    email?: string | null
    role: string
  } | null
}

export function useUser(): UseUserReturn {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setIsAdmin(session.user.role === 'admin')
    } else {
      setIsAdmin(false)
    }
  }, [session])

  return {
    isAdmin,
    loading: status === 'loading',
    user: session?.user || null
  }
}

// Keep the existing useUsers function for admin functionality
export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        } else {
          setError('Failed to fetch users')
        }
      } catch {
        setError('Error fetching users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading, error }
} 
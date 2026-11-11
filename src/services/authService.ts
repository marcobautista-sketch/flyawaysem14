import api from '../api'
import type { NewIdResponse, RegisterRequest, User } from '../types'

export async function register(data: RegisterRequest) {
  const response = await api.post<NewIdResponse>('/users/register', data)
  return response.data
}

export async function login(email: string, password: string) {
  const response = await api.post<{ token: string }>('/auth/login', { email, password })
  return response.data.token
}

export async function getCurrentUser() {
  const response = await api.get<User>('/users/current')
  return response.data
}

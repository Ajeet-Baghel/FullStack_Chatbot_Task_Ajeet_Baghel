export interface Enquiry {
  id: number
  name: string
  email: string
  phone: string
  user_type: string
  interest: string
  message: string
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed'
  created_at: string
  updated_at: string
}

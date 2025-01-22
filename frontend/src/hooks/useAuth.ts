import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { logout } from '@/store/auth/authSlice'
import Cookies from 'js-cookie'

export const useAuth = () => {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    Cookies.remove('token')
  }

  return {
    isLoggedIn,
    handleLogout
  }
}
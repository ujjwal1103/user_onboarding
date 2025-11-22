import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { logout } from '@/features/auth/authSlice'

interface LogoutButtonProps {
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  className?: string
}

export const LogoutButton = ({
  variant = 'ghost',
  size = 'sm',
  className,
}: LogoutButtonProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }, [dispatch, navigate])

  return (
    <Button variant={variant} size={size} className={className} onClick={handleLogout}>
      Log out
    </Button>
  )
}

export default LogoutButton


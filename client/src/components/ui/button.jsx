import { cn } from '../../lib/utils'

const Button = ({ className, ...props }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'bg-gray-900 text-gray-50 hover:bg-gray-800',
      className,
    )}
    {...props}
  />
)

export { Button }

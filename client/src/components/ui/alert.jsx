import { cn } from '../../lib/utils'

const Alert = ({ className, ...props }) => (
  <div
    role="alert"
    className={cn(
      'relative w-full rounded-lg border border-gray-200 p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950',
      className,
    )}
    {...props}
  />
)

const AlertTitle = ({ className, ...props }) => (
  <h5
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
)

const AlertDescription = ({ className, ...props }) => (
  <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
)

export { Alert, AlertTitle, AlertDescription }

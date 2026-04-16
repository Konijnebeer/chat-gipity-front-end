import { CircleQuestionMark } from "lucide-react"
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"

const LUCIDE_ICON_NAME_SET = new Set(iconNames)

function IconComponent({
  iconName,
  color,
  fallBackIcon,
  className,
}: {
  iconName: string
  color?: string
  fallBackIcon?: React.ReactNode
  className?: string
}) {
  if (!iconName) {
    return fallBackIcon ?? <CircleQuestionMark />
  }

  if (!LUCIDE_ICON_NAME_SET.has(iconName as IconName)) {
    return (
      <span
        className="text-destructive [&_svg]:text-destructive"
        title={`Invalid icon: ${iconName}`}
      >
        {fallBackIcon ?? <CircleQuestionMark className={className} />}
      </span>
    )
  }
  return (
    <DynamicIcon
      name={iconName as IconName}
      color={color}
      className={className}
    />
  )
  // return <CircleQuestionMark className={className} color={color} />
}

export { IconComponent }

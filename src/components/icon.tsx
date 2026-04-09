import { CircleQuestionMark } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"



function IconComponent({ iconName, color, fallBackIcon }: { iconName: string, color?: string, fallBackIcon?: React.ReactNode }) { 
  if (!iconName) {
    return fallBackIcon ?? <CircleQuestionMark />
  }
  return <DynamicIcon name={iconName as IconName} color={color} />
}

export { IconComponent }
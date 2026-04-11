import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/account')({
  component: RouteComponent,
})

function RouteComponent() {
  // Card with user info and option to edit account details
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <p>Here you can view and edit your account details.</p>
      {/* Add form or components to display and edit user info */}
    </div>

    // Card with tokens used stats
    // Tokens used this dat, this week
    // Bar of % of max tokens of weekly limit used

    // Card with agents used and bar graph with how much (only show top 5 most used agents and group the rest in "other")


  )
}

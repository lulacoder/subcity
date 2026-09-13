import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/directory')({
  component: DirectoryLayout,
})

function DirectoryLayout() {
  return <Outlet />
}
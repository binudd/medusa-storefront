import { useMemo, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons"
import {
  Button,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DropdownMenu,
  Heading,
  IconButton,
  StatusBadge,
  Text,
  toast,
  useDataTable,
  usePrompt,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/sdk"
import type {
  AdminHeroBanner,
  AdminHeroBannerListResponse,
} from "../../../lib/hero-banner"

const columnHelper = createDataTableColumnHelper<AdminHeroBanner>()

function formatSchedule(banner: AdminHeroBanner) {
  if (!banner.starts_at && !banner.ends_at) {
    return "Always"
  }
  const start = banner.starts_at
    ? new Date(banner.starts_at).toLocaleString()
    : "—"
  const end = banner.ends_at ? new Date(banner.ends_at).toLocaleString() : "—"
  return `${start} → ${end}`
}

const HeroBannersPage = () => {
  const navigate = useNavigate()
  const prompt = usePrompt()
  const queryClient = useQueryClient()
  const limit = 20
  const [pagination, setPagination] = useState({
    pageSize: limit,
    pageIndex: 0,
  })

  const offset = useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination]
  )

  const { data, isLoading } = useQuery({
    queryKey: ["hero-banners", limit, offset],
    queryFn: () =>
      sdk.client.fetch<AdminHeroBannerListResponse>("/admin/hero-banners", {
        query: { limit, offset },
      }),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] })

  const toggleMutation = useMutation({
    mutationFn: async (banner: AdminHeroBanner) => {
      await sdk.client.fetch(`/admin/hero-banners/${banner.id}`, {
        method: "POST",
        body: { is_active: !banner.is_active },
      })
    },
    onSuccess: (_, banner) => {
      toast.success(
        banner.is_active ? "Banner deactivated" : "Banner activated"
      )
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      return sdk.client.fetch<{ hero_banner: AdminHeroBanner }>(
        `/admin/hero-banners/${id}/duplicate`,
        { method: "POST" }
      )
    },
    onSuccess: ({ hero_banner }) => {
      toast.success("Banner duplicated")
      invalidate()
      navigate(`/content/hero-banners/${hero_banner.id}`)
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await sdk.client.fetch(`/admin/hero-banners/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      toast.success("Banner deleted")
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const handleDelete = async (banner: AdminHeroBanner) => {
    const confirmed = await prompt({
      title: "Delete hero banner?",
      description: `This will permanently delete "${banner.name}".`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    })
    if (confirmed) {
      deleteMutation.mutate(banner.id)
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Text size="small" weight="plus" leading="compact">
              {row.original.name}
            </Text>
            {row.original.heading ? (
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {row.original.heading}
              </Text>
            ) : null}
          </div>
        ),
      }),
      columnHelper.display({
        id: "preview",
        header: "Preview",
        cell: ({ row }) => {
          const src =
            row.original.desktop_image_url || row.original.mobile_image_url
          if (!src) {
            return (
              <Text size="small" className="text-ui-fg-muted">
                —
              </Text>
            )
          }
          return (
            <img
              src={src}
              alt=""
              className="h-10 w-16 rounded object-cover"
            />
          )
        },
      }),
      columnHelper.accessor("is_active", {
        header: "Status",
        cell: ({ getValue }) => (
          <StatusBadge color={getValue() ? "green" : "grey"}>
            {getValue() ? "Active" : "Inactive"}
          </StatusBadge>
        ),
      }),
      columnHelper.display({
        id: "schedule",
        header: "Schedule",
        cell: ({ row }) => (
          <Text size="small" leading="compact">
            {formatSchedule(row.original)}
          </Text>
        ),
      }),
      columnHelper.accessor("sort_order", {
        header: "Sort",
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated",
        cell: ({ getValue }) => (
          <Text size="small" leading="compact">
            {new Date(getValue()).toLocaleString()}
          </Text>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const banner = row.original
          return (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton size="small" variant="transparent">
                  <EllipsisHorizontal />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  className="gap-x-2"
                  onClick={() =>
                    navigate(`/content/hero-banners/${banner.id}`)
                  }
                >
                  <PencilSquare className="text-ui-fg-subtle" />
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="gap-x-2"
                  onClick={() => duplicateMutation.mutate(banner.id)}
                >
                  Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="gap-x-2"
                  onClick={() => toggleMutation.mutate(banner)}
                >
                  {banner.is_active ? "Deactivate" : "Activate"}
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  className="gap-x-2"
                  onClick={() => handleDelete(banner)}
                >
                  <Trash className="text-ui-fg-subtle" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          )
        },
      }),
    ],
    [navigate, duplicateMutation, toggleMutation]
  )

  const table = useDataTable({
    columns,
    data: data?.hero_banners || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div>
            <Heading>Hero Banners</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              Manage homepage hero banners shown on the storefront.
            </Text>
          </div>
          <Button size="small" asChild>
            <Link to="/content/hero-banners/create">
              <Plus />
              Create
            </Link>
          </Button>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Hero Banners",
})

export default HeroBannersPage

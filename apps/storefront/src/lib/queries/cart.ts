"use client"

import {
  addPromotionCode,
  addToCart,
  deleteLineItem,
  removePromotionCode,
  retrieveCartFresh,
  updateLineItem,
} from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query"

import { queryKeys } from "./keys"

type Cart = HttpTypes.StoreCart | null

/**
 * The current customer's cart. Hydrated from the server on first render via
 * `HydrationBoundary` in the main layout, then owned by TanStack Query.
 */
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.detail(),
    queryFn: () => retrieveCartFresh(),
    refetchOnWindowFocus: true,
  })
}

export function useCartItemCount() {
  const { data } = useCart()
  return data?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
}

type MutationCallbacks<TVariables> = Pick<
  UseMutationOptions<Cart, Error, TVariables, { previous: Cart }>,
  "onSuccess" | "onError" | "onSettled"
>

function useOptimisticCartMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<Cart>,
  optimisticUpdate: (cart: Cart, variables: TVariables) => Cart,
  callbacks?: MutationCallbacks<TVariables>
) {
  const queryClient = useQueryClient()
  const key = queryKeys.cart.detail()

  return useMutation<Cart, Error, TVariables, { previous: Cart }>({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Cart>(key) ?? null
      queryClient.setQueryData<Cart>(key, (cart) =>
        optimisticUpdate(cart ?? null, variables)
      )
      return { previous }
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(key, context.previous)
      }
      callbacks?.onError?.(error, variables, context)
    },
    onSuccess: (cart, variables, context) => {
      if (cart) {
        queryClient.setQueryData(key, cart)
      }
      callbacks?.onSuccess?.(cart, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      // Reconcile with server truth (prices, promotions, totals) after any
      // mutation regardless of outcome.
      queryClient.invalidateQueries({ queryKey: key })
      callbacks?.onSettled?.(data, error, variables, context)
    },
  })
}

export function useAddToCart(
  callbacks?: MutationCallbacks<{
    variantId: string
    quantity: number
    countryCode: string
  }>
) {
  const queryClient = useQueryClient()
  const key = queryKeys.cart.detail()

  return useMutation<
    Cart,
    Error,
    { variantId: string; quantity: number; countryCode: string },
    { previous: Cart }
  >({
    mutationFn: (variables) => addToCart(variables),
    onSuccess: (cart, variables, context) => {
      if (cart) {
        queryClient.setQueryData(key, cart)
      }
      callbacks?.onSuccess?.(cart, variables, context)
    },
    onError: callbacks?.onError,
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: key })
      callbacks?.onSettled?.(data, error, variables, context)
    },
  })
}

export function useUpdateLineItem(
  callbacks?: MutationCallbacks<{ lineId: string; quantity: number }>
) {
  return useOptimisticCartMutation<{ lineId: string; quantity: number }>(
    (variables) => updateLineItem(variables),
    (cart, { lineId, quantity }) => {
      if (!cart?.items) return cart
      return {
        ...cart,
        items: cart.items.map((item) =>
          item.id === lineId ? { ...item, quantity } : item
        ),
      }
    },
    callbacks
  )
}

export function useDeleteLineItem(
  callbacks?: MutationCallbacks<{ lineId: string }>
) {
  return useOptimisticCartMutation<{ lineId: string }>(
    ({ lineId }) => deleteLineItem(lineId),
    (cart, { lineId }) => {
      if (!cart?.items) return cart
      return {
        ...cart,
        items: cart.items.filter((item) => item.id !== lineId),
      }
    },
    callbacks
  )
}

export function useAddPromotion(callbacks?: MutationCallbacks<{ code: string }>) {
  const queryClient = useQueryClient()
  const key = queryKeys.cart.detail()

  return useMutation<Cart, Error, { code: string }, { previous: Cart }>({
    mutationFn: ({ code }) => addPromotionCode(code),
    onSuccess: (cart, variables, context) => {
      if (cart) queryClient.setQueryData(key, cart)
      callbacks?.onSuccess?.(cart, variables, context)
    },
    onError: callbacks?.onError,
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: key })
      callbacks?.onSettled?.(data, error, variables, context)
    },
  })
}

export function useRemovePromotion(
  callbacks?: MutationCallbacks<{ code: string }>
) {
  return useOptimisticCartMutation<{ code: string }>(
    ({ code }) => removePromotionCode(code),
    (cart, { code }) => {
      if (!cart?.promotions) return cart
      return {
        ...cart,
        promotions: cart.promotions.filter((p) => p.code !== code),
      }
    },
    callbacks
  )
}

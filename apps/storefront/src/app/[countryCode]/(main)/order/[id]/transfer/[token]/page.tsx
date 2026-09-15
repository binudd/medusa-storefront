import TransferActions from "@modules/order/components/transfer-actions"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const { id, token } = await params

  return (
    <div className="content-container max-w-xl py-16">
      <h1 className="text-2xl font-medium tracking-tight">
        Transfer request for order {id}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You&apos;ve received a request to transfer ownership of this order. If
        you accept, the new owner takes over all responsibilities for it.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        If you do not recognize this request, you can decline it or ignore this
        page.
      </p>
      <div className="mt-8">
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}

import { declineTransferRequest } from "@lib/data/orders"
import { ErrorMessage } from "@/components/common/error-message"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const { id, token } = await params
  const { success, error } = await declineTransferRequest(id, token)

  return (
    <div className="content-container max-w-xl py-16">
      {success ? (
        <>
          <h1 className="text-2xl font-medium tracking-tight">
            Transfer declined
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Transfer of order {id} was declined.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-medium tracking-tight">
            Could not decline transfer
          </h1>
          <ErrorMessage error={error} className="mt-4" />
        </>
      )}
    </div>
  )
}

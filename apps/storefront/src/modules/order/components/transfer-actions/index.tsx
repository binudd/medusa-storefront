"use client"

import { acceptTransferRequest, declineTransferRequest } from "@lib/data/orders"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/common/error-message"

type TransferStatus = "pending" | "success" | "error"

const TransferActions = ({ id, token }: { id: string; token: string }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<{
    accept: TransferStatus | null
    decline: TransferStatus | null
  }>({
    accept: null,
    decline: null,
  })

  const acceptTransfer = async () => {
    setStatus({ accept: "pending", decline: null })
    setErrorMessage(null)
    const { success, error } = await acceptTransferRequest(id, token)
    if (error) setErrorMessage(error)
    setStatus({ accept: success ? "success" : "error", decline: null })
  }

  const declineTransfer = async () => {
    setStatus({ accept: null, decline: "pending" })
    setErrorMessage(null)
    const { success, error } = await declineTransferRequest(id, token)
    if (error) setErrorMessage(error)
    setStatus({ accept: null, decline: success ? "success" : "error" })
  }

  return (
    <div className="flex flex-col gap-4">
      {status.accept === "success" && (
        <p className="text-sm text-success" role="status">
          Order transferred successfully.
        </p>
      )}
      {status.decline === "success" && (
        <p className="text-sm text-success" role="status">
          Order transfer declined.
        </p>
      )}
      {status.accept !== "success" && status.decline !== "success" && (
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={acceptTransfer}
            isLoading={status.accept === "pending"}
            disabled={status.accept === "pending" || status.decline === "pending"}
          >
            Accept transfer
          </Button>
          <Button
            variant="outline"
            onClick={declineTransfer}
            isLoading={status.decline === "pending"}
            disabled={status.accept === "pending" || status.decline === "pending"}
          >
            Decline transfer
          </Button>
        </div>
      )}
      <ErrorMessage error={errorMessage} />
    </div>
  )
}

export default TransferActions

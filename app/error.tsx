'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("App Error:", error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-6 ring-1 ring-destructive/20">
                <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Đã có lỗi xảy ra!</h2>
            <p className="text-muted-foreground mb-8 max-w-[500px]">
                Chúng tôi rất tiếc về sự cố này. Hệ thống đã ghi nhận lỗi và sẽ khắc phục sớm nhất.
                <br />
                <span className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block font-mono">
                    Error: {error.message || "Unknown error"}
                </span>
            </p>

            <div className="flex gap-4">
                <Button onClick={() => reset()} size="lg">
                    Thử lại
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
                    Về trang chủ
                </Button>
            </div>
        </div>
    )
}

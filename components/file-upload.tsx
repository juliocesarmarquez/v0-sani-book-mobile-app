"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, ImageIcon, Film, File } from "lucide-react"
import { uploadFileToIPFS } from "@/app/actions/upload-to-ipfs"

interface FileUploadProps {
  onUploadComplete: (fileData: any) => void
  onUploadStart: () => void
  category: string
  tags: string
}

export function FileUpload({ onUploadComplete, onUploadStart, category, tags }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 200)
    return interval
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first")
      return
    }

    try {
      setError(null)
      setIsUploading(true)
      onUploadStart()

      const progressInterval = simulateProgress()

      const formData = new FormData()
      formData.append("file", selectedFile)

      const result = await uploadFileToIPFS(formData)

      clearInterval(progressInterval)

      if (result.success) {
        setUploadProgress(100)

        const fileData = {
          ...result,
          category,
          tags,
          date: new Date().toISOString().split("T")[0],
        }

        onUploadComplete(fileData)

        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)
          clearSelectedFile()
        }, 1500)
      } else {
        setError(result.error || "Error uploading file")
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (err) {
      setError("Unexpected error uploading file")
      setIsUploading(false)
      setUploadProgress(0)
      console.error("[v0] Upload error:", err)
    }
  }

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-12 h-12 text-gray-400" />

    const fileType = selectedFile.type
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="w-12 h-12 text-blue-500" />
    } else if (fileType === "application/pdf") {
      return <FileText className="w-12 h-12 text-red-500" />
    } else if (fileType.startsWith("video/")) {
      return <Film className="w-12 h-12 text-purple-500" />
    } else {
      return <File className="w-12 h-12 text-gray-500" />
    }
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          selectedFile ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-blue-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center">
          {getFileIcon()}

          {selectedFile ? (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2">
                <span className="font-medium text-green-700">{selectedFile.name}</span>
                {!isUploading && (
                  <button
                    onClick={clearSelectedFile}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove selected file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium mt-4 mb-2">Drag your medical files here</h3>
              <p className="text-gray-500 mb-4">or click to select</p>
            </>
          )}

          <div className="mt-4">
            {!isUploading ? (
              <div className="flex gap-4">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isUploading}>
                  Select File
                </Button>

                {selectedFile && (
                  <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
                    Upload to IPFS
                  </Button>
                )}
              </div>
            ) : (
              <div className="w-full max-w-md">
                <p className="text-sm mb-1 text-blue-700 font-medium">Uploading to IPFS...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  )
}

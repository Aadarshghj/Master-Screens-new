import React, { useState } from "react"
import { Upload, File, Check } from "lucide-react"

interface FileUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  accept = ".pdf,.doc,",
  maxSizeMB = 2
}) => {
  const [dragActive, setDragActive] = useState(false)
  const handleFile = (file: File | null) => {
    if (!file) return
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) return
    onChange(file)
  }

  return (
    <div className="w-full">

      <div
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition
        ${dragActive ? "border-gray-500 bg-gray-150" : "border-gray-150"}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          const file = e.dataTransfer.files[0]
          handleFile(file)
        }}
      >

        <input
          type="file"
          className="hidden"
          id="fileUploadInput"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />

        <label
          htmlFor="fileUploadInput"
          className="flex flex-col items-center gap-1 cursor-pointer"
        >

          <div className="w-8 h-8 flex items-center justify-center bg-blue-700 text-white rounded-md">
            <Upload size={16} />
          </div>

          <p className="text-sm text-gray-600">
            Drag and drop files or <span className="text-primary">browse</span>
          </p>

          <p className="text-xs text-gray-400">
          {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")} · MAX {maxSizeMB}MB
          </p>

        </label>
        </div>

      {value && (

        <div className="mt-3 flex items-center justify-between bg-primary text-white px-3 py-2 rounded-md text-sm">

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center bg-blue-700 text-white rounded-md">
            <File size={15} />
            </div>
            <span>{value.name}</span>
          </div>

          <div className="hexagon bg-white text-primary flex items-center justify-center w-5 h-5">
            <Check size={14} />
          </div>
        </div>
      )}
   </div>
  )
}
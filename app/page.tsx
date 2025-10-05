"use client"

import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Upload,
  Shield,
  Globe,
  FileText,
  ImageIcon,
  Activity,
  Download,
  Eye,
  QrCode,
  Share2,
  Plus,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Settings,
  Bell,
  BarChart3,
  PieChart,
  FolderOpen,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/file-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SaniBookLogo } from "@/components/sanibook-logo"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface MedicalFile {
  id: number | string
  name: string
  type: string
  size: string
  date: string
  ipfsHash: string
  category: string
  profileId: string
  cid?: string
  gatewayUrl?: string
  shared?: boolean
}

interface MedicalProfile {
  id: string
  name: string
  relationship: string
  avatar?: string
  filesCount: number
  lastUpload: string
  age: number
  color: string
}

export default function SaniBookApp() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [activeProfile, setActiveProfile] = useState("self")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [walletError, setWalletError] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [fileCategory, setFileCategory] = useState("Lab Results")
  const [fileTags, setFileTags] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState<MedicalFile | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [isIPhone13, setIsIPhone13] = useState(false)

  useEffect(() => {
    // Detect iPhone 13 screen size
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsIPhone13(width === 390 || (width >= 375 && width <= 428))
    }
    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const [profiles, setProfiles] = useState<MedicalProfile[]>([
    {
      id: "self",
      name: "John Doe",
      relationship: "Self",
      avatar: "",
      filesCount: 24,
      lastUpload: "2 days ago",
      age: 35,
      color: "bg-blue-500",
    },
    {
      id: "son",
      name: "Michael Doe",
      relationship: "Son",
      avatar: "",
      filesCount: 12,
      lastUpload: "1 week ago",
      age: 8,
      color: "bg-green-500",
    },
    {
      id: "grandfather",
      name: "Robert Doe Sr.",
      relationship: "Grandfather",
      avatar: "",
      filesCount: 45,
      lastUpload: "3 days ago",
      age: 72,
      color: "bg-purple-500",
    },
    {
      id: "uncle",
      name: "James Doe",
      relationship: "Uncle",
      avatar: "",
      filesCount: 18,
      lastUpload: "1 month ago",
      age: 58,
      color: "bg-orange-500",
    },
  ])

  const [medicalFiles, setMedicalFiles] = useState<MedicalFile[]>([
    {
      id: 1,
      name: "Blood_Test_Results_2024.pdf",
      type: "PDF",
      size: "2.4 MB",
      date: "2024-01-15",
      ipfsHash: "QmX7Y8Z9Ab1Cd2Ef3Gh4Ij5Kl6...",
      category: "Lab Results",
      profileId: "self",
      shared: true,
    },
    {
      id: 2,
      name: "Chest_Xray_Jan2024.jpg",
      type: "Image",
      size: "8.1 MB",
      date: "2024-01-10",
      ipfsHash: "QmA1B2C3De4Fg5Hi6Jk7Lm8...",
      category: "Imaging",
      profileId: "self",
      shared: false,
    },
    {
      id: 3,
      name: "ECG_Reading_Dec2023.pdf",
      type: "PDF",
      size: "1.2 MB",
      date: "2023-12-28",
      ipfsHash: "QmD4E5F6Gh7Ij8Kl9Mn0Op1...",
      category: "Cardiology",
      profileId: "grandfather",
      shared: true,
    },
    {
      id: 4,
      name: "Vaccination_Record_2024.pdf",
      type: "PDF",
      size: "0.8 MB",
      date: "2024-01-05",
      ipfsHash: "QmV1W2X3Yz4Ab5Cd6Ef7Gh8...",
      category: "Immunization",
      profileId: "son",
      shared: false,
    },
  ])

  const [sharedLinks] = useState([
    {
      id: 1,
      fileName: "Blood_Test_Results_2024.pdf",
      sharedWith: "Dr. Smith",
      expiresIn: "7 days",
      views: 3,
    },
    {
      id: 2,
      fileName: "ECG_Reading_Dec2023.pdf",
      sharedWith: "Cardiologist Office",
      expiresIn: "14 days",
      views: 1,
    },
  ])

  const isWindowDefined = typeof window !== "undefined"

  const handleWalletConnect = async () => {
    setWalletError("")

    if (process.env.NODE_ENV === "development" || isDemoMode) {
      setIsDemoMode(true)
      setIsConnected(true)
      return
    }

    if (isWindowDefined && window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        setIsConnected(true)
      } catch (error: any) {
        if (error.code === 4001 || error.message?.includes("rejected")) {
          // User rejected the connection request - this is normal
          console.log("[v0] User declined wallet connection")
          setWalletError(
            "You declined the connection request. Click 'Get Started' to try again, or use 'Preview Demo' to explore without connecting.",
          )
        } else {
          // Actual error occurred
          console.error("[v0] Wallet connection error:", error)
          setWalletError("Failed to connect wallet. Please try again or check your wallet extension.")
        }
      }
    } else {
      console.log("[v0] No ethereum wallet detected")
      setWalletError("No wallet detected. Please install MetaMask or another Web3 wallet.")
    }
  }

  const handleUploadStart = () => {
    setIsUploading(true)
    setUploadSuccess(null)
  }

  const handleUploadComplete = (fileData: any) => {
    setIsUploading(false)

    const newFile: MedicalFile = {
      id: Date.now(),
      name: fileData.fileName,
      type: fileData.type.includes("image") ? "Image" : fileData.type.includes("pdf") ? "PDF" : "Document",
      size: `${(fileData.size / 1024 / 1024).toFixed(2)} MB`,
      date: new Date().toISOString().split("T")[0],
      ipfsHash: fileData.cid,
      category: fileCategory,
      profileId: activeProfile,
      cid: fileData.cid,
      gatewayUrl: fileData.gatewayUrl,
      shared: false,
    }

    setMedicalFiles((prevFiles) => [newFile, ...prevFiles])
    setUploadSuccess(newFile)

    setProfiles((prevProfiles) =>
      prevProfiles.map((p) => (p.id === activeProfile ? { ...p, filesCount: p.filesCount + 1 } : p)),
    )

    setTimeout(() => {
      setActiveTab("dashboard")
    }, 2000)
  }

  const enableDemoMode = () => {
    setIsDemoMode(true)
    setIsConnected(true)
  }

  const currentProfile = profiles.find((p) => p.id === activeProfile) || profiles[0]
  const profileFiles = medicalFiles.filter((f) => f.profileId === activeProfile)
  const totalStorage = medicalFiles.reduce((acc, file) => {
    const size = Number.parseFloat(file.size)
    return acc + size
  }, 0)

  const stats = {
    totalFiles: profileFiles.length,
    totalStorage: `${totalStorage.toFixed(1)} MB`,
    categories: new Set(profileFiles.map((f) => f.category)).size,
    sharedFiles: profileFiles.filter((f) => f.shared).length,
    recentUploads: profileFiles.filter((f) => new Date(f.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-[390px] mx-auto px-3 py-3 flex items-center justify-between">
            <SaniBookLogo size={28} showText={true} />
            <Button onClick={handleWalletConnect} size="sm" className="bg-blue-600 hover:bg-blue-700 h-10 text-sm">
              <Wallet className="w-4 h-4 mr-1.5" />
              Connect
            </Button>
          </div>
        </header>

        <main className="max-w-[390px] mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-sanibook-blue to-sanibook-blue-dark bg-clip-text text-transparent leading-tight">
              Your Medical Records,
              <br />
              Truly Yours
            </h1>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed px-2">
              Store your medical files securely on IPFS. Access them anywhere with your wallet.
            </p>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <Card className="border-blue-200 hover:shadow-lg transition-shadow text-left">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-blue-900 text-base mb-1">Decentralized Storage</CardTitle>
                      <p className="text-gray-600 text-sm">Files on IPFS, no single point of failure.</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow text-left">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-green-900 text-base mb-1">Wallet-Based Access</CardTitle>
                      <p className="text-gray-600 text-sm">Access with your crypto wallet. No passwords.</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-shadow text-left">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-purple-900 text-base mb-1">Always Available</CardTitle>
                      <p className="text-gray-600 text-sm">24/7 access. True data sovereignty.</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="mb-5 text-center">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5">
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                Web3 Enabled
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleWalletConnect}
                size="lg"
                className="w-full bg-gradient-to-r from-sanibook-blue to-sanibook-blue-dark hover:from-blue-700 hover:to-blue-800 text-white h-12 text-base"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Get Started
              </Button>

              <Button
                onClick={enableDemoMode}
                size="lg"
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent h-12"
              >
                Preview Demo
              </Button>
            </div>

            {walletError && (
              <Alert className="mt-4" variant="destructive">
                <AlertTitle className="text-sm">Connection Error</AlertTitle>
                <AlertDescription className="text-xs">
                  {walletError}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline ml-1"
                  >
                    Download MetaMask
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[390px] mx-auto px-3 py-2.5">
          <div className="flex items-center justify-between">
            <SaniBookLogo size={26} showText={true} />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[390px] mx-auto px-3 py-3 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
          <TabsList className="grid w-full grid-cols-3 h-12 sticky top-[57px] z-40 bg-white">
            <TabsTrigger value="dashboard" className="flex flex-col items-center gap-0.5 py-1 text-xs">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex flex-col items-center gap-0.5 py-1 text-xs">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col items-center gap-0.5 py-1 text-xs">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-3 mt-3">
            {/* Profile Selector - iPhone 13 optimized */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Medical Profiles</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 h-8 text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3 px-3">
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setActiveProfile(profile.id)}
                      className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                        activeProfile === profile.id
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-gray-50 border-2 border-transparent"
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className={`${profile.color} text-white font-semibold text-sm`}>
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {profile.filesCount > 0 && (
                          <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                            {profile.filesCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-medium">{profile.name.split(" ")[0]}</p>
                        <p className="text-[10px] text-gray-500">{profile.relationship}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Profile Info - iPhone 13 optimized */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold mb-0.5">{currentProfile.name}</h3>
                    <p className="text-blue-100 text-xs">
                      {currentProfile.relationship} • {currentProfile.age} years old
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowQR(!showQR)} className="h-8 text-xs">
                    <QrCode className="w-3.5 h-3.5 mr-1" />
                    Share
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-[10px] text-blue-100">Total Files</span>
                    </div>
                    <p className="text-xl font-bold">{stats.totalFiles}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="w-3.5 h-3.5" />
                      <span className="text-[10px] text-blue-100">Storage Used</span>
                    </div>
                    <p className="text-xl font-bold">{stats.totalStorage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid - iPhone 13 optimized */}
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardContent className="pt-4 pb-4 px-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center mb-1.5">
                      <FolderOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold">{stats.categories}</p>
                    <p className="text-[10px] text-gray-500">Categories</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4 px-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center mb-1.5">
                      <Share2 className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xl font-bold">{stats.sharedFiles}</p>
                    <p className="text-[10px] text-gray-500">Shared</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4 px-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center mb-1.5">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xl font-bold">{stats.recentUploads}</p>
                    <p className="text-[10px] text-gray-500">This Week</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4 px-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center mb-1.5">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-xl font-bold">{profiles.length}</p>
                    <p className="text-[10px] text-gray-500">Profiles</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Storage Overview - iPhone 13 optimized */}
            <Card>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Storage Overview</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <PieChart className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-3 pb-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">IPFS Storage</span>
                    <span className="font-medium">{stats.totalStorage} / 500 MB</span>
                  </div>
                  <Progress value={(totalStorage / 500) * 100} className="h-1.5" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-[10px] text-gray-600">Documents</span>
                    </div>
                    <p className="text-base font-bold">{profileFiles.filter((f) => f.type === "PDF").length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-[10px] text-gray-600">Images</span>
                    </div>
                    <p className="text-base font-bold">{profileFiles.filter((f) => f.type === "Image").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shared Links - iPhone 13 optimized */}
            <Card>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <CardTitle className="text-sm">Shared Access</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 h-7 text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    New
                  </Button>
                </div>
                <CardDescription className="text-xs">Active shared links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                {sharedLinks.map((link) => (
                  <div key={link.id} className="flex items-start justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-xs font-medium truncate">{link.fileName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-500">Shared with {link.sharedWith}</span>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">
                          <Eye className="w-2.5 h-2.5 mr-0.5" />
                          {link.views}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <QrCode className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Files - iPhone 13 optimized */}
            <Card>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Recent Files</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 h-7 text-xs">
                    View All
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 px-3 pb-3">
                {profileFiles.slice(0, 5).map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        file.type === "PDF" ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      {file.type === "PDF" ? (
                        <FileText className="w-4 h-4 text-red-600" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-gray-500">{file.size}</span>
                        <span className="text-[10px] text-gray-400">•</span>
                        <span className="text-[10px] text-gray-500">{file.date}</span>
                        {file.shared && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-auto">
                            <Share2 className="w-2.5 h-2.5 mr-0.5" />
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}

                {profileFiles.length === 0 && (
                  <div className="text-center py-6">
                    <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs mb-2">No medical files yet</p>
                    <Button onClick={() => setActiveTab("upload")} variant="outline" size="sm" className="h-8 text-xs">
                      Upload First File
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Timeline - iPhone 13 optimized */}
            <Card>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-2.5">
                  {[
                    { action: "Uploaded", file: "Blood Test Results", time: "2 hours ago", icon: Upload },
                    { action: "Shared", file: "ECG Reading", time: "1 day ago", icon: Share2 },
                    { action: "Downloaded", file: "Chest X-ray", time: "3 days ago", icon: Download },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs">
                          <span className="font-medium">{activity.action}</span> {activity.file}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab - iPhone 13 optimized */}
          <TabsContent value="upload" className="space-y-3 mt-3">
            <Card>
              <CardHeader className="px-3 pt-3 pb-2">
                <CardTitle className="text-base">Upload Medical Files</CardTitle>
                <CardDescription className="text-xs">Supported: PDF, JPG, PNG, DICOM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-3 pb-3">
                {uploadSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <Shield className="h-3.5 w-3.5 text-green-600" />
                    <AlertTitle className="text-green-800 text-xs">Upload Successful!</AlertTitle>
                    <AlertDescription className="text-green-700 text-[11px]">
                      <strong>{uploadSuccess.name}</strong> stored on IPFS.
                      <div className="mt-0.5 text-[10px] font-mono">
                        CID: {uploadSuccess.ipfsHash?.substring(0, 15)}...
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label className="mb-2 block text-xs">Upload for Profile</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => setActiveProfile(profile.id)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 transition-all ${
                          activeProfile === profile.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className={`${profile.color} text-white text-[10px]`}>
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{profile.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <FileUpload
                  onUploadStart={handleUploadStart}
                  onUploadComplete={handleUploadComplete}
                  category={fileCategory}
                  tags={fileTags}
                />

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="category" className="text-xs">
                      File Category
                    </Label>
                    <select
                      id="category"
                      className="w-full mt-1.5 p-2.5 border rounded-lg bg-white text-sm"
                      value={fileCategory}
                      onChange={(e) => setFileCategory(e.target.value)}
                    >
                      <option>Lab Results</option>
                      <option>Imaging (X-ray, MRI, CT)</option>
                      <option>Cardiology (ECG, Echo)</option>
                      <option>Prescriptions</option>
                      <option>Immunization Records</option>
                      <option>Discharge Summary</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="tags" className="text-xs">
                      Tags (optional)
                    </Label>
                    <Input
                      id="tags"
                      placeholder="e.g., blood work, checkup"
                      className="mt-1.5 h-10 text-sm"
                      value={fileTags}
                      onChange={(e) => setFileTags(e.target.value)}
                    />
                  </div>
                </div>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-3 pb-3 px-3">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900 text-xs">Privacy & Security</h4>
                        <p className="text-[11px] text-green-700 mt-0.5">
                          Files encrypted before upload. Only you can access with your wallet.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-xs font-medium mb-2">Recent Uploads</h3>
                  <div className="space-y-1.5">
                    {profileFiles.slice(0, 3).map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-[10px] text-gray-500">{file.date}</p>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0 text-[10px] h-4 px-1.5">
                          {file.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - iPhone 13 optimized */}
          <TabsContent value="settings" className="space-y-3 mt-3">
            <Card>
              <CardHeader className="px-3 pt-3 pb-2">
                <CardTitle className="text-base">Account Settings</CardTitle>
                <CardDescription className="text-xs">Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{currentProfile.name}</p>
                      <p className="text-xs text-gray-500">{currentProfile.relationship}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                    Edit
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs">Wallet Address</Label>
                  <div className="mt-1.5 p-2 bg-gray-50 rounded-lg font-mono text-[11px] break-all">
                    {isDemoMode ? "0xDemo...1234 (Demo)" : "0x742d35Cc...4C9db"}
                  </div>
                  {isDemoMode && (
                    <Alert className="mt-2">
                      <AlertDescription className="text-[11px]">Demo mode. No real transactions.</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label className="text-xs">Network</Label>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? "bg-orange-500" : "bg-green-500"}`}></div>
                    <span className="text-xs">{isDemoMode ? "Demo Network" : "Ethereum Mainnet"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-3 pt-3 pb-2">
                <CardTitle className="text-base">Storage Settings</CardTitle>
                <CardDescription className="text-xs">Configure IPFS storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">Auto-backup</Label>
                    <p className="text-[11px] text-gray-500">Pin to multiple IPFS nodes</p>
                  </div>
                  <Switch className="scale-90" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">Encryption</Label>
                    <p className="text-[11px] text-gray-500">Encrypt before upload</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] h-5">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-3 pt-3 pb-2">
                <CardTitle className="text-base">Privacy & Sharing</CardTitle>
                <CardDescription className="text-xs">Control access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">Healthcare Provider Access</Label>
                    <p className="text-[11px] text-gray-500">Allow verified providers</p>
                  </div>
                  <Switch className="scale-90" />
                </div>

                <Separator />

                <div>
                  <Label className="text-xs mb-1.5 block">Share Link Expiration</Label>
                  <select className="w-full p-2.5 border rounded-lg bg-white text-sm">
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                    <option>Never expire</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="px-3 pt-3 pb-2">
                <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
                <CardDescription className="text-xs">Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent h-9 text-xs"
                >
                  Export All Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent h-9 text-xs"
                >
                  Delete All Files
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

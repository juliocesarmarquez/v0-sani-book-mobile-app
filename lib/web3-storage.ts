import { Web3Storage } from "web3.storage"

// Función para obtener un cliente de Web3Storage
function getWeb3StorageClient() {
  // Asegúrate de que la API key esté disponible
  const token = process.env.WEB3_STORAGE_API_KEY
  if (!token) {
    throw new Error("Web3.Storage API key not found. Please set WEB3_STORAGE_API_KEY in your environment variables.")
  }

  // Crear y devolver el cliente
  return new Web3Storage({ token })
}

// Función para subir un archivo a IPFS a través de Web3.Storage
export async function uploadToIPFS(file: File) {
  try {
    const client = getWeb3StorageClient()

    // Crear un objeto File[] que Web3Storage necesita
    const fileArray = [file]

    // Nombre para el archivo en Web3.Storage (opcional)
    const fileName = `sundchain-${Date.now()}`

    // Subir el archivo y obtener el CID
    console.log(`Uploading file ${file.name} to IPFS...`)
    const cid = await client.put(fileArray, { name: fileName })

    // Construir la URL de IPFS
    const ipfsUrl = `ipfs://${cid}/${file.name}`
    // URL para acceder a través de una gateway pública
    const gatewayUrl = `https://w3s.link/ipfs/${cid}/${file.name}`

    console.log(`File uploaded successfully. CID: ${cid}`)

    return {
      success: true,
      cid,
      ipfsUrl,
      gatewayUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
    }
  } catch (error) {
    console.error("Error uploading file to IPFS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Función para recuperar un archivo desde IPFS
export async function retrieveFromIPFS(cid: string) {
  try {
    const client = getWeb3StorageClient()
    const res = await client.get(cid)

    if (!res || !res.ok) {
      throw new Error(`Error retrieving file with CID: ${cid}`)
    }

    // Obtener los archivos
    const files = await res.files()
    return {
      success: true,
      files,
    }
  } catch (error) {
    console.error("Error retrieving file from IPFS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Cloudinary CDN
require('dotenv').config()

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
})
// console.log(cloudinary.config())

async function handleUpload(file) {
  const options = {
    folder: '/sw-skills/skills', //TODO: remove / ?
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "auto"
  }

  const res = await cloudinary.uploader.upload(file, options)
  return res
}

async function getAssetInfo(publicId) {
  return await cloudinary.api.resource(publicId)
}

async function deleteAsset(publicId) {
  await cloudinary.uploader.destroy(publicId)
}

async function searchAsset(publicId) {
  return await cloudinary.search
    .expression(publicId)
    .fields('public_id')
    .max_results(1)
    .execute()
}

module.exports = { handleUpload, getAssetInfo, searchAsset, deleteAsset }
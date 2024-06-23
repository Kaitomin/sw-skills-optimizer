
const router = require('express').Router()
const Skill = require('../models/Skills')
const multer = require('multer')
const fs = require("fs")
const { handleUpload, getAssetInfo, deleteAsset, searchAsset } = require('../helpers')

// Set Multer storage to intercept FormData
const storage = multer.memoryStorage()
const upload = multer({ storage })
const uploadMiddleware = upload.single('icon')

router.post('/add-skill', uploadMiddleware, async (req, res) => {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const skill = { ...req.body }

    delete skill._id
    delete skill.secureUrl
    
    // Upload skill icon to Cloudinary
    await runMiddleware(req, res, uploadMiddleware)
    const b64 = Buffer.from(req.file.buffer).toString("base64")
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64
    const cldRes = await handleUpload(dataURI)

    skill.icon = cldRes.secure_url

    await Skill.create(skill)
    res.status(201).json({ skill })
  } catch(e) {
    console.log(e)
  }
})

router.put('/update-skill', uploadMiddleware, async(req, res) => {
  const urlArr = req.body.secureUrl.split('/')
  const publicId = urlArr.slice(urlArr.length - 3).join('/').split('.')[0]
  const id = req.body._id

  const skill = { ...req.body }

  skill.icon = req.body.secureUrl
  delete skill.secureUrl

  if (req.body.dwBoost) skill.dwBoost = req.body.dwBoost

  try {
    if (req.file) {
      await runMiddleware(req, res, uploadMiddleware)
      const b64 = Buffer.from(req.file.buffer).toString("base64")
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64
      const cldRes = await handleUpload(dataURI)

      skill.icon = cldRes.secure_url

      // Delete previous skill icon in Cloudinary
      const file = await searchAsset(publicId)
      if (file.resources[0].folder == 'sw-skills/skills') await deleteAsset(file.resources[0].public_id)
    }
    
    await Skill.findByIdAndUpdate(id, skill)
    res.end()
  } catch (err) {
    console.log('ERROR', err)
  }
})

router.post('/delete-skill', async(req, res) => {
  const { _id, icon } = req.body
  const urlArr = req.body.icon.split('/')
  const publicId = urlArr.slice(urlArr.length - 3).join('/').split('.')[0]

  // Delete skill in DB
  await Skill.findByIdAndRemove(_id)

  // Delete skill icon in Cloudinary
  const file = await searchAsset(publicId)
  if (file.resources[0].folder == 'sw-skills/skills') await deleteAsset(file.resources[0].public_id)

  res.end()
})


function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

module.exports = router

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
    const skill = {
      skillName: req.body.skillName,
      dmg: req.body.dmg,
      cast: req.body.cast,
      castCancel: req.body.castCancel,
      cd: req.body.cd,
      character: req.body.character,
      icon: null
    }

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

  const skill = {
    skillName: req.body.skillName,
    dmg: req.body.dmg,
    cast: req.body.cast,
    castCancel: req.body.castCancel,
    cd: req.body.cd,
    character: req.body.character,
    icon: req.body.secureUrl
  }

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
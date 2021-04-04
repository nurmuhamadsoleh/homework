const { success, failed } = require("../../config/response");
const { classes } = require("../../models");
const path = require('path')
const fs = require('fs')

exports.get = async ({ query }, res) => {
  const where = {};
  if (query.id) where.id = query.id;
  try {
    const data = await classes.findAll({
      where,
     
    });
    return res.json(success({ message: "data class berhasil diterima", data }));
  } catch (error) {
    return res.json(failed({ data: error }));
  }
};

exports.show = async ( req, res) => {
  const where = {id : req.params.id};
 
  try {
    const data = await classes.findAll({
      where,
     
    });
    return res.json(success({ message: "data berhasil diterima", data: data }));
  } catch (error) {
    return res.json(failed({ message: "ERROR SYSTEM", data: error }));
  }
};

exports.create = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      code: req.body.code,
      date_start :  req.body.date_start,
      date_end : req.body.date_end,
      description : req.body.description,
      //photo : req.body.photo
    };
    if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')
            [req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(path.resolve(__dirname, '../..'), `public/foto/${filename}`);

            const src = fs.createReadStream(tmp_path);

            const dest = fs.createWriteStream(target_path);

            src.pipe(dest);

            src.on('end', async () => {
                
                payload.photo = filename;
                const data = await classes.create(payload);
                return res.json(success({ message: "data berhasil ditambahkan", data }));
              
            });

            src.on('error', async () => {
                if (err && err.name === 'ValidationError') {
                    return res.json({
                        error : 1,
                        message : err.message,
                        fields : err.errors
                    });
                }
               // next(err)
                next(err)
            })
            
        } else {

            const data = await classes.create(payload);
            return res.json(success({ message: "data berhasil ditambahkan", data }));
            
        }
    
  } catch (error) {
    return res.json(failed({ data: error.message }));
  }
};

exports.update = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      code: req.body.code,
      date_start :  req.body.date_start,
      date_end : req.body.date_end,
      description : req.body.description,
      //photo : req.body.photo
    };
    const where = {
      id: req.body.id,
    };
    if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')
            [req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(path.resolve(__dirname, '../..'), `public/foto/${filename}`);

            const src = fs.createReadStream(tmp_path);

            const dest = fs.createWriteStream(target_path);

            src.pipe(dest);

            src.on('end', async () => {
                const kelas = await classes.findOne({ where});
                
                let base_url = path.resolve(__dirname, '../..');
                let currentImage = `${base_url}/public/foto/${kelas.photo}`;
              console.log(currentImage)
                if (fs.existsSync(currentImage)) {
                    fs.unlinkSync(currentImage)    
                }

              payload.photo = filename;
               const data = await classes.update(payload, { where });
                return res.json(
                  success({
                    message: "data berhasil diperbarui",
                    data: { ...where, ...payload },
                  })
                );
              
            });

            src.on('error', async () => {

                next(err)
            })
            
        } else {

           const data = await classes.update(payload, { where });
              return res.json(
                success({
                  message: "data berhasil diperbarui",
                  data: { ...where, ...payload },
                })
              );
            
        }

    
  } catch (error) {
    return res.json(failed({ data: error }));
  }
};

exports.del = async ({body}, res) => {

  console.log(body)
  try {
    const where = {
      id: body.id,
    };
    const kelas = await classes.findOne({ where});

                let base_url = path.resolve(__dirname, '../..');
                let currentImage = `${base_url}/public/foto/${kelas.photo}`;

                if (fs.existsSync(currentImage)) {
                    fs.unlinkSync(currentImage)    
                }
    const data = await classes.destroy({ where });
    if (data)
      return res.json(
        success({
          message: "data berhasil dihapus",
          data,
        })
      );
    else throw "Data tidak ditemukan";
  } catch (error) {
    return res.json(failed({ data: error.message }));
  }
};
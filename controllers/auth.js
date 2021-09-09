const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await  User.findOne({ email })
        if( user ){ 
            return res.status(400).json({
                ok: false,
                msg: 'Correo electrónico ya está siendo usado.'
            })
        }
        user = new User( req.body );
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
        await user.save();
       
        // Generar JWT
        const token = await generateJWT( user.id, user.name );
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Ha sucedido un error, póngase en contacto con el administrador.'
        })
    }
}

const userLogin = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        let user = await  User.findOne({ email })
        if( !user ){ 
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email.'
            })
        }
        
        // Confirmar contraseña
        const validPassword = bcrypt.compareSync( password, user.password );
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto.'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id, user.name );
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Ha sucedido un error, póngase en contacto con el administrador.'
        })
    }
}

const validateToken = async(req, res = response) => {
    const { uid, name } = req;
    const token = await generateJWT( uid, name );
    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    createUser,
    userLogin,
    validateToken
}
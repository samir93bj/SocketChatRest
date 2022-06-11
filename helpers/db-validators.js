const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Category = require('../models/category');
const Product = require('../models/product');

//Verificamos si el ROL existe
const esRoleValido =   async ( rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if (!existeRol){
        throw new Error(`El rol: ${rol} no es correcto. Seleccione un rol Correcto.`);
        }
  }

  //Verificamos si el mail existe
  const mailExistente = async (email = '') => {

    //Verificamos si el correo ya existe
    const existeEmail = await Usuario.findOne({email});

    if(existeEmail) {
      throw new Error(`Este email ${email} ya esta registrado`);
    }
};


  //Verificamos si el id existe
  const idExistente = async (id = '') => {
    const usuariosExiste = await Usuario.findById(id);
      if (!usuariosExiste){
        throw new Error(`El id: ${id} no existe.`);
      }
  }

  //Verificamos la existencia de la categoria
  const nameCategoryExist = async (name = '') => {
    const namef = name.toUpperCase();
  
    const category = await Category.findOne({ name: namef });
    if (category){ 
      throw new Error(`La categoria: ${namef} ya existe.`);
    }
  }

  //Verificamos si ID Categoria Existe
  const idCategoryExist = async (id = '') => {

    const category = await Category.findById(id);

    if (!category){
      throw new Error(`La categoria: ${id} no existe.`);
    }
  } 

  //Verificamos si ID Product Existe - NAME
  const idProductExist = async (id = '') => {

  const product = await Product.findById(id);

    if (!product){
      throw new Error(`El producto: ${id} no existe.`);
    }
  } 


    //Verificamos la existencia del Producto
    const nameProductExist = async (name = '') => {
      const namef = name.toUpperCase();
  
      const product = await Product.findOne({ name: namef  });
      if (product){ 
        throw new Error(`El producto: ${namef} ya existe.`);
      }
    }

  //verificamos ID de files
  const allowedColecction = async (collection = '', collections = []) => {

    if (!collections.includes(collection)){
      throw new Error(`La coleccion: ${collection} no existe. Las colecciones permitidas son: ${collections}`);
    }

  }

  module.exports = {
    esRoleValido,
    mailExistente,
    idExistente,
    idCategoryExist,
    nameCategoryExist,
    idProductExist,
    nameProductExist,
    allowedColecction
  }

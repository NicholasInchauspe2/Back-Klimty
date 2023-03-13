const express = require("express");
const { Cart, User, Product } = require("../models");
const nodemailer = require("nodemailer")

const router = express.Router();

// SOLO SE CREAN CARRITOS AL DESPACHAR ORDEN DE COMPRA Y REGISTRO DE USUARIO NUEVO

// Get all carts
// historial => findAll solo carritos con status false
router.get("/", (req, res, next) => {
  Cart.findAll()
    .then((carts) => res.send(carts))
    .catch(next);
});

// Get cart by ID ??????????
router.get("/:id", (req, res, next) => {
  Cart.findByPk(req.params.id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }
      res.send(cart);
    })
    .catch(next);
});

// Create a new cart
router.post("/:userId", (req, res, next) => {
  Cart.create({ userId: req.params.userId, state: true })
    .then((cart) => res.status(201).send(cart))
    .catch(next);
});

// Add product to cart
//FRONT!! mandar dentro de la ruta el ID del USER y el ID del PRODUCT a agregar

router.post("/:userId/add/:productId", (req, res, next) => {
  const { userId, productId } = req.params;

  User.findByPk(userId).then((user) => {
    if (!user) res.status(404).send("User not found");
  });
  Product.findByPk(productId).then((product) => {
    if (!product) res.status(404).send("User not found");
  });

  Cart.findOne({
    where: { userId, state: true },
  })
    .then((cart) => {
      const productIndex = cart.products.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex === -1) {
        cart.update({
          products: [...cart.products, { quantity: 1, productId }],
        });
      } else {
        const updatedProducts = cart.products.map((product, index) => {
          if (index === productIndex) {
            return { ...product, quantity: product.quantity + 1 };
          } else {
            return product;
          }
        });

        cart.update({ products: updatedProducts });
      }

      res.send(cart);
    })
    .catch(next);
});

// Delete product by ID from cart
//FRONT!! mandar dentro de la ruta el ID del USER y el ID del PRODUCT a eliminar
router.post("/:userId/delete/:productId", (req, res, next) => {
  const { userId, productId } = req.params;

  User.findByPk(userId).then((user) => {
    if (!user) res.status(404).send("User not found");
  });
  Product.findByPk(productId).then((product) => {
    if (!product) res.status(404).send("User not found");
  });

  Cart.findOne({
    where: { userId, state: true },
  })
    .then((cart) => {
      const productIndex = cart.products.findIndex(
        (item) => item.productId === productId
      );

      if (cart.products[productIndex].quantity > 1) {
        const updatedProducts = cart.products.map((product, index) => {
          if (index === productIndex) {
            return { ...product, quantity: product.quantity - 1 };
          } else {
            return product;
          }
        });
        cart.update({ products: updatedProducts });
      } else {
        const updatedProducts = cart.products.filter(
          (product) => product.productId !== productId
        );
        cart.update({ products: updatedProducts });
      }

      res.send(cart);
    })
    .catch(next);
});

// EDIT THE AMOUNT OF PRODUCT IN CART
router.post("/:userId/edit/:productId", (req, res, next) => {
    const { userId, productId } = req.params;
    const { amount } = req.query;
  
    User.findByPk(userId).then((user) => {
      if (!user) res.status(404).send("User not found");
    });
    Product.findByPk(productId).then((product) => {
      if (!product) res.status(404).send("Product not found");
    });
  
    Cart.findOne({
      where: { userId, state: true },
    })
      .then((cart) => {
        const productIndex = cart.products.findIndex(
          (item) => item.productId === productId
        );
        if (amount > 0) {
          const updatedProducts = cart.products.map((product, index) => {
            if (index === productIndex) {
              return { ...product, quantity: parseInt(amount) };
            } else {
              return product;
            }
          });
          cart.update({ products: updatedProducts });
        } else {
          const updatedProducts = cart.products.filter(
            (product) => product.productId !== productId
          );
          cart.update({ products: updatedProducts });
        }
        res.status(204).send(cart);
      })
      .catch(next);
  });



// IGNORAR =>

/* router.post("/:userId/checkout", (req, res, next) => {
  const userId = req.params.userId;
  Cart.findOne({ where: { userId, state: true } }).then((cart) => {
    const totalCart = cart.dataValues.products
    console.log(totalCart)

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "Klimty Ecommerce",
        pass: "Klimty1234",
      },
    });

    User.findByPk(userId).then((user) => {
const {name, lastName, email} = user

      const message = {
        from: "klimtyecommerce@gmail.com",
        to: email,
        subject: `Your purchased all the items on your cart.`,
        text: "Don't really have much to say",
      };
      transporter.sendMail(message, function (err, data) {
        if (err) {
           next(err)
        } else {
          res.status(200).send(data);
        }
        })
      });
    })


   
});

router.get("/:userId/buyOrden", (req, res) => {
  const id = req.params.userId
  BuyOrden.findAll({
    where: {
    userId: id
    }
  }).then((userBuyOrden) => {
    res.status(200).send(userBuyOrden)
  })
}); */

module.exports = router;

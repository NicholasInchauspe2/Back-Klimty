const { User } = require("../models")
const Checkout = require("../models/Checkout");

const getAllUsers = async () => {
    try {
        const allUsers = await User.findAll();
        return allUsers
    } catch (err) {
        return err
    }
}

const changeStatus = async (state, userId, checkoutId) => {
    try {
        const admin = await User.findByPk(userId)
        if (admin.isAdmin === true) {
            const checkoutToModified = await Checkout.findByPk(checkoutId)
            const modifiedStatus = await checkoutToModified.update(state)
          return modifiedStatus
        }
        else {
          return {error: "Your account is not admin"}
        }
      } catch (err) {
        return err
      }
}

const findAllByAdmin = async (userId) => {
    try {
        const user = await User.findByPk(userId)
        if (user.isAdmin === true) {
          const users = await User.findAll()
          return users
        } else return {error: "Your account is not admin"}
      } catch (err) {
        return(err)
      }
}

const deleteUser = async (userId, deleteUserID) => {
    try {
        const admin = await User.findByPk(userId)
        if (admin.isAdmin === true) {
          const userToDelete = await User.findByPk(deleteUserID)
          const deletedUser = await userToDelete.destroy()
          return deletedUser
        }
        return {error: "Your account is not admin"}
      } catch (err) {
        return(err)
      }
}

const newAdmin = async (userId, newAdminId) => {
    try {
        const admin = await User.findByPk(userId)
        if (admin.isAdmin === true && admin.id !== newAdminId) {
          const userToMakeAdmin = await User.findByPk(newAdminId)
          if (userToMakeAdmin.isAdmin === true) {
              const newAdmin = await userToMakeAdmin.update({ isAdmin: false })
              return newAdmin
          } else {
            const newAdmin = await userToMakeAdmin.update({ isAdmin: true })
          return newAdmin
          }
        }
        return {error: "Your account is not admin"}
      } catch (err) {
        return(err)
    }
}

const findById = async (id) => {
    try {
        const userToFind = await User.findByPk(id)
        return userToFind
      } catch (err) {
        return(err)
      }
}

const createUser = async (name, lastName, email, uid) => {
    try {
        const NewUser = await User.findOrCreate({ where: { name, lastName, email, uid } })
        return NewUser
      } catch (err) {
        return (err)
      }
}

const updateUser = async (id, name, lastName, uid, isAdmin) => {
    try {
        const userToUpdate = await User.findByPk(id)
        const updatedUser = await userToUpdate.update({ name, lastName, uid, isAdmin })
        return updatedUser
      } catch (err) {
        return (err)
      }
}

const findByUid = async (uid) => {
    try {
        const user = await User.findOne({ where: { uid: uid.toString() } })
        return user
      } catch (err) {
        return(err)
      }
}



module.exports = { getAllUsers, changeStatus, findAllByAdmin, deleteUser, newAdmin, findById, createUser, updateUser, findByUid }
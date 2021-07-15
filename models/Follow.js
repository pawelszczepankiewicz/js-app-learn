const userCollection = require('../db').db().collection("users")
const followsCollection = require('../db').db().collection("follows")
const { ObjectID } = require('mongodb').ObjectID

let Follow = function (followedUsername, authorId) {
    this.followedUsername = followedUsername
    this.authorId = authorId
    this.errors = []
}

Follow.prototype.clenaUp = function () {
    if (typeof(this.followedUsername) != "string") {this.followedUsername = ""}
}

Follow.prototype.validate = async function () {
    //followedUsername must exist in db
    let followedAccount = await userCollection.findOne({username: this.followedUsername})
    if (followedAccount) {
        this.followedId = followedAccount._id
    } else {
        this.errors.push("You can not follow user that does not exist")
    }
}

Follow.prototype.create = function () {
    return new Promise(async (resolve, reject) => {
        this.clenaUp()
        await this.validate()
        if (!this.errors.length) {
            await followsCollection.insertOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

module.exports = Follow